import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/patients", label: "Patients" },
  { to: "/appointments", label: "Appointments" },
  { to: "/ambulance", label: "Ambulance" },
  { to: "/blood", label: "Blood bank" },
  { to: "/hospitals", label: "Hospitals" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="mark">Setu Register</span>
        <span className="tag">Clinic & emergency desk</span>
      </div>
      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-foot">Built for the H2S hackathon</div>
    </aside>
  );
}

export default Sidebar;
