import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Placeholder Routes for Dashboards */}
        <Route path="/citizen/dashboard" element={<div className="p-10 text-xl font-bold">Citizen Dashboard (Coming Soon)</div>} />
        <Route path="/supervisor/dashboard" element={<div className="p-10 text-xl font-bold">Supervisor Dashboard (Coming Soon)</div>} />
        <Route path="/depthead/dashboard" element={<div className="p-10 text-xl font-bold">Dept Head Dashboard (Coming Soon)</div>} />
        <Route path="/superadmin/dashboard" element={<div className="p-10 text-xl font-bold">Super Admin Dashboard (Coming Soon)</div>} />
      </Routes>
    </Router>
  );
}

export default App;