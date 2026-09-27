import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PageHead from "../components/PageHead";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusDot from "../components/StatusDot";
import { useToast } from "../context/ToastContext";

const empty = { patient: "", doctorName: "", date: "", reason: "" };

function Appointments() {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [apts, pats] = await Promise.all([api.get("/appointments"), api.get("/patients")]);
      setAppointments(apts.data);
      setPatients(pats.data);
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
      await api.post("/appointments", form);
      showToast("Appointment booked");
      setForm(empty);
      load();
    } catch (err) {
      showToast(err.response?.data?.error || "Could not book appointment", "error");
    }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/appointments/${id}`, { status });
    showToast(`Marked as ${status.toLowerCase()}`);
    load();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await api.delete(`/appointments/${pendingDelete._id}`);
    showToast("Appointment removed");
    setPendingDelete(null);
    load();
  };

  return (
    <div>
      <PageHead title="Appointments" subtitle={`${appointments.length} total`} />

      <div className="panel">
        <h3>Book an appointment</h3>
        {patients.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>Add a patient first before booking an appointment.</p>
        ) : (
          <form className="form-grid" onSubmit={handleSubmit}>
            <div>
              <label className="field-label">Patient</label>
              <select name="patient" value={form.patient} onChange={handleChange} required>
                <option value="">Select patient</option>
                {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Doctor</label>
              <input name="doctorName" value={form.doctorName} onChange={handleChange} required />
            </div>
            <div>
              <label className="field-label">Date & time</label>
              <input name="date" type="datetime-local" value={form.date} onChange={handleChange} required />
            </div>
            <div>
              <label className="field-label">Reason for visit</label>
              <textarea name="reason" value={form.reason} onChange={handleChange} />
            </div>
            <div className="row-actions"><button type="submit" className="btn">Book appointment</button></div>
          </form>
        )}
      </div>

      <div className="panel">
        {loading ? (
          <Skeleton rows={4} />
        ) : appointments.length === 0 ? (
          <EmptyState glyph="○" lead="No appointments booked" hint="Use the form above to add the first one." />
        ) : (
          <table className="register-table">
            <thead><tr><th>Patient</th><th>Doctor</th><th>When</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.patient?.name || "—"}</td>
                  <td>{a.doctorName}</td>
                  <td className="mono">{new Date(a.date).toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                  <td><StatusDot status={a.status} /></td>
                  <td>
                    <div className="row-actions">
                      <select className="status-select" value={a.status} onChange={(e) => updateStatus(a._id, e.target.value)}>
                        <option>Scheduled</option><option>Completed</option><option>Cancelled</option><option>No-show</option>
                      </select>
                      <button className="btn small urgent" onClick={() => setPendingDelete(a)}>Remove</button>
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
        title="Remove this appointment?"
        message="This will delete the booking permanently."
        confirmLabel="Remove"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default Appointments;
