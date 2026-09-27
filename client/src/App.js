import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { ToastProvider } from "./context/ToastContext";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Ambulance from "./pages/Ambulance";
import BloodBank from "./pages/BloodBank";
import Hospitals from "./pages/Hospitals";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Sidebar />
          <main className="main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/ambulance" element={<Ambulance />} />
              <Route path="/blood" element={<BloodBank />} />
              <Route path="/hospitals" element={<Hospitals />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
