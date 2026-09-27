import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PageHead from "../components/PageHead";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import StatusDot from "../components/StatusDot";
import { useToast } from "../context/ToastContext";

const empty = { requesterName: "", phone: "", pickupLocation: "", dropLocation: "", notes: "" };

function Ambulance() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ambulance");
      setRequests(res.data);
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
      await api.post("/ambulance", form);
      showToast("Ambulance request logged");
      setForm(empty);
      load();
    } catch (err) {
      showToast(err.response?.data?.error || "Could not submit request", "error");
    }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/ambulance/${id}`, { status });
    showToast(`Marked as ${status.toLowerCase()}`);
    load();
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  return (
    <div>
      <PageHead title="Ambulance requests" subtitle={pendingCount > 0 ? `${pendingCount} waiting for dispatch` : "None waiting"} />

      <div className="panel">
        <h3>Log a new request</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="field-label">Requester name</label>
            <input name="requesterName" value={form.requesterName} onChange={handleChange} required />
          </div>
          <div>
            <label className="field-label">Phone number</label>
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <div>
            <label className="field-label">Pickup location</label>
            <input name="pickupLocation" value={form.pickupLocation} onChange={handleChange} required />
          </div>
          <div>
            <label className="field-label">Drop location (hospital)</label>
            <input name="dropLocation" value={form.dropLocation} onChange={handleChange} />
          </div>
          <div>
            <label className="field-label">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} />
          </div>
          <div className="row-actions"><button type="submit" className="btn urgent">Submit request</button></div>
        </form>
      </div>

      <div className="panel">
        {loading ? (
          <Skeleton rows={3} />
        ) : requests.length === 0 ? (
          <EmptyState glyph="○" lead="No ambulance requests logged" hint="Submitted requests will appear here for dispatch tracking." />
        ) : (
          <table className="register-table">
            <thead><tr><th>Requester</th><th>Phone</th><th>Pickup</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td>{r.requesterName}</td>
                  <td className="mono">{r.phone}</td>
                  <td>{r.pickupLocation}</td>
                  <td><StatusDot status={r.status} /></td>
                  <td>
                    <select className="status-select" value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)}>
                      <option>Pending</option><option>Dispatched</option><option>Completed</option><option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Ambulance;
