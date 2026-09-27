import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PageHead from "../components/PageHead";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import StatusDot from "../components/StatusDot";
import { useToast } from "../context/ToastContext";

const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const empty = { type: "Need", name: "", phone: "", bloodGroup: "O+", location: "", unitsNeeded: 1 };

function BloodBank() {
  const { showToast } = useToast();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [searchGroup, setSearchGroup] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchGroup) params.bloodGroup = searchGroup;
      if (searchLocation) params.location = searchLocation;
      const res = await api.get("/blood", { params });
      setEntries(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/blood", form);
      showToast(form.type === "Need" ? "Blood request posted" : "Donor availability recorded");
      setForm(empty);
      load();
    } catch (err) {
      showToast(err.response?.data?.error || "Could not save entry", "error");
    }
  };

  return (
    <div>
      <PageHead title="Blood bank" subtitle="Match needs with nearby donors" />

      <div className="panel">
        <h3>Report a need or availability</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="field-label">This entry is for</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="Need">A blood need</option>
              <option value="Donate">A donor's availability</option>
            </select>
          </div>
          <div>
            <label className="field-label">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="field-label">Phone number</label>
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="field-label">Blood group</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                {groups.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            {form.type === "Need" && (
              <div style={{ flex: 1 }}>
                <label className="field-label">Units needed</label>
                <input name="unitsNeeded" type="number" min="1" value={form.unitsNeeded} onChange={handleChange} />
              </div>
            )}
          </div>
          <div>
            <label className="field-label">Location / city</label>
            <input name="location" value={form.location} onChange={handleChange} required />
          </div>
          <div className="row-actions"><button type="submit" className="btn">Save entry</button></div>
        </form>
      </div>

      <div className="panel">
        <h3>Search the register</h3>
        <div className="search-row">
          <select value={searchGroup} onChange={(e) => setSearchGroup(e.target.value)}>
            <option value="">Any blood group</option>
            {groups.map((g) => <option key={g}>{g}</option>)}
          </select>
          <input placeholder="Location" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
          <button type="button" className="btn outline small" onClick={load}>Search</button>
        </div>

        {loading ? (
          <Skeleton rows={3} />
        ) : entries.length === 0 ? (
          <EmptyState glyph="○" lead="No matching entries" hint="Try clearing the filters, or add an entry above." />
        ) : (
          <table className="register-table">
            <thead><tr><th>Type</th><th>Name</th><th>Group</th><th>Location</th><th>Phone</th><th>Status</th></tr></thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e._id}>
                  <td>{e.type === "Need" ? "Needed" : "Donor"}</td>
                  <td>{e.name}</td>
                  <td className="mono">{e.bloodGroup}</td>
                  <td>{e.location}</td>
                  <td className="mono">{e.phone}</td>
                  <td><StatusDot status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BloodBank;
