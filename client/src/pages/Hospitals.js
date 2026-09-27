import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PageHead from "../components/PageHead";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import { useToast } from "../context/ToastContext";

const empty = { name: "", type: "Hospital", location: "", phone: "", hasAmbulance: false };

function Hospitals() {
  const { showToast } = useToast();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [locationFilter, setLocationFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (locationFilter) params.location = locationFilter;
      const res = await api.get("/hospitals", { params });
      setHospitals(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/hospitals", form);
      showToast("Facility added to directory");
      setForm(empty);
      load();
    } catch (err) {
      showToast(err.response?.data?.error || "Could not add facility", "error");
    }
  };

  return (
    <div>
      <PageHead title="Hospitals & clinics" subtitle={`${hospitals.length} listed`} />

      <div className="panel">
        <h3>Add a facility</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="field-label">Facility name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="field-label">Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option>Hospital</option><option>Clinic</option><option>Blood Bank</option>
            </select>
          </div>
          <div>
            <label className="field-label">Location / city</label>
            <input name="location" value={form.location} onChange={handleChange} required />
          </div>
          <div>
            <label className="field-label">Phone number</label>
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5 }}>
            <input type="checkbox" name="hasAmbulance" checked={form.hasAmbulance} onChange={handleChange} style={{ width: "auto" }} />
            Has an ambulance on call
          </label>
          <div className="row-actions"><button type="submit" className="btn">Add facility</button></div>
        </form>
      </div>

      <div className="panel">
        <div className="search-row">
          <input placeholder="Filter by location" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
          <button type="button" className="btn outline small" onClick={load}>Search</button>
        </div>

        {loading ? (
          <Skeleton rows={3} />
        ) : hospitals.length === 0 ? (
          <EmptyState glyph="○" lead="No facilities listed yet" hint="Add the nearest hospital, clinic, or blood bank above." />
        ) : (
          <table className="register-table">
            <thead><tr><th>Name</th><th>Type</th><th>Location</th><th>Phone</th><th>Ambulance</th></tr></thead>
            <tbody>
              {hospitals.map((h) => (
                <tr key={h._id}>
                  <td>{h.name}</td>
                  <td>{h.type}</td>
                  <td>{h.location}</td>
                  <td className="mono">{h.phone}</td>
                  <td>{h.hasAmbulance ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Hospitals;
