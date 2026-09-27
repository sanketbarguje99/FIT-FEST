import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PageHead from "../components/PageHead";
import Skeleton from "../components/Skeleton";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ patients: 0, appointments: 0, ambulance: 0, blood: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [byGroup, setByGroup] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [patients, appointments, ambulance, blood] = await Promise.all([
          api.get("/patients"),
          api.get("/appointments?upcoming=true"),
          api.get("/ambulance"),
          api.get("/blood?type=Need"),
        ]);
        setStats({
          patients: patients.data.length,
          appointments: appointments.data.length,
          ambulance: ambulance.data.filter((a) => a.status === "Pending").length,
          blood: blood.data.filter((b) => b.status === "Open").length,
        });
        setUpcoming(appointments.data.slice(0, 5));

        const counts = {};
        patients.data.forEach((p) => {
          counts[p.bloodGroup] = (counts[p.bloodGroup] || 0) + 1;
        });
        const max = Math.max(1, ...Object.values(counts));
        setByGroup(
          Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([group, count]) => ({ group, count, pct: Math.round((count / max) * 100) }))
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <PageHead title="Dashboard" subtitle="Today's snapshot of the register" />

      {loading ? (
        <div className="panel"><Skeleton rows={4} /></div>
      ) : (
        <>
          <div className="stat-strip">
            <div className="stat-cell">
              <div className="figure mono">{stats.patients}</div>
              <div className="label">Patients on record</div>
            </div>
            <div className="stat-cell">
              <div className="figure mono">{stats.appointments}</div>
              <div className="label">Upcoming appointments</div>
            </div>
            <div className={`stat-cell ${stats.ambulance > 0 ? "urgent" : ""}`}>
              <div className="figure mono">{stats.ambulance}</div>
              <div className="label">Pending ambulance calls</div>
            </div>
            <div className={`stat-cell ${stats.blood > 0 ? "urgent" : ""}`}>
              <div className="figure mono">{stats.blood}</div>
              <div className="label">Open blood requests</div>
            </div>
          </div>

          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "16px" }}>
            <div className="panel">
              <h3>Next on the appointment list</h3>
              {upcoming.length === 0 ? (
                <p style={{ color: "var(--muted)" }}>Nothing booked yet. Add one from the Appointments page.</p>
              ) : (
                <table className="register-table">
                  <tbody>
                    {upcoming.map((a) => (
                      <tr key={a._id}>
                        <td>{a.patient?.name || "—"}</td>
                        <td className="mono">{new Date(a.date).toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                        <td>{a.doctorName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="panel">
              <h3>Patients by blood group</h3>
              {byGroup.length === 0 ? (
                <p style={{ color: "var(--muted)" }}>Add patients to see this breakdown.</p>
              ) : (
                byGroup.map((row) => (
                  <div className="bar-row" key={row.group}>
                    <div className="bar-label mono">{row.group}</div>
                    <div className="bar-track"><div className="bar-fill" style={{ width: `${row.pct}%` }} /></div>
                    <div className="bar-value">{row.count}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
