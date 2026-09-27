import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import PageHead from "../components/PageHead";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";

const empty = { name: "", age: "", gender: "Male", phone: "", bloodGroup: "Unknown", address: "" };

function Patients() {
  const { showToast } = useToast();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/patients");
      setPatients(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/patients/${editingId}`, form);
        showToast("Patient record updated");
      } else {
        await api.post("/patients", form);
        showToast("Patient added to register");
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.error || "Could not save patient", "error");
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, age: p.age, gender: p.gender, phone: p.phone, bloodGroup: p.bloodGroup, address: p.address || "" });
    setEditingId(p._id);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await api.delete(`/patients/${pendingDelete._id}`);
    showToast("Patient removed");
    setPendingDelete(null);
    load();
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return patients;
    const q = query.toLowerCase();
    return patients.filter((p) => p.name.toLowerCase().includes(q) || p.phone.includes(q));
  }, [patients, query]);

  return (
    <div>
      <PageHead title="Patients" subtitle={`${patients.length} on record`} />

      <div className="panel">
        <h3>{editingId ? "Update patient record" : "Add to register"}</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="field-label">Full name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="field-label">Age</label>
              <input name="age" type="number" value={form.age} onChange={handleChange} required />
            </div>
            <div style={{ flex: 1 }}>
              <label className="field-label">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="field-label">Phone number</label>
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <div>
            <label className="field-label">Blood group</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
              {["Unknown", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Address</label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>
          <div className="row-actions">
            <button type="submit" className="btn">{editingId ? "Save changes" : "Add patient"}</button>
            {editingId && (
              <button type="button" className="btn subtle" onClick={() => { setForm(empty); setEditingId(null); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="search-row">
          <input placeholder="Search by name or phone" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {loading ? (
          <Skeleton rows={4} />
        ) : filtered.length === 0 ? (
          <EmptyState glyph="○" lead={query ? "No matches in the register" : "The register is empty"} hint={query ? "Try a different name or number." : "Add the first patient above."} />
        ) : (
          <table className="register-table">
            <thead>
              <tr><th>No.</th><th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Group</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p._id}>
                  <td className="num">{String(patients.length - patients.indexOf(p)).padStart(3, "0")}</td>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td className="mono">{p.phone}</td>
                  <td>{p.bloodGroup}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn small subtle" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="btn small urgent" onClick={() => setPendingDelete(p)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Remove patient record?"
        message={pendingDelete ? `${pendingDelete.name} will be removed from the register. This can't be undone.` : ""}
        confirmLabel="Remove"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default Patients;
