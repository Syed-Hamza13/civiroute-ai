import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages Imports
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Dashboards Imports
import SuperAdminDashboard from './pages/Dashboards/SuperAdmin'; 
import DeptHeadDashboard from './pages/Dashboards/DeptHead';
import SupervisorDashboard from './pages/Dashboards/Supervisor';
import CitizenDashboard from './pages/Dashboards/Citizen'; // Naya import

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Real Routes for Dashboards */}
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/depthead/dashboard" element={<DeptHeadDashboard />} />
        <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;