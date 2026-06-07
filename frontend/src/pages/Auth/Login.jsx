import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, UserCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('Citizen');
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const roles = ['Citizen', 'Supervisor', 'DeptHead', 'SuperAdmin'];

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`Login Attempt [${activeRole}]:`, credentials);
    // API Call goes here (pass role in body)
    
    // Dummy Routing based on role
    if(activeRole === 'Citizen') navigate('/citizen/dashboard');
    if(activeRole === 'Supervisor') navigate('/supervisor/dashboard');
    if(activeRole === 'DeptHead') navigate('/depthead/dashboard');
    if(activeRole === 'SuperAdmin') navigate('/superadmin/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-sm border border-zinc-200">
        
        {/* Role Selector Tabs */}
        <div className="flex bg-zinc-100 p-1 rounded-lg mb-8 text-sm">
          {roles.map(role => (
            <button 
              key={role}
              onClick={() => setActiveRole(role)}
              className={`flex-1 py-1.5 rounded-md font-medium transition-all ${activeRole === role ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              {role === 'DeptHead' ? 'Admin' : role}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">{activeRole} Portal</h1>
          <p className="text-zinc-500 text-sm mt-1">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {activeRole === 'Citizen' ? 'Email or Mobile Number' : 'Official Email / User ID'}
            </label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <input 
                type="text" 
                required 
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-zinc-900 outline-none" 
                placeholder={activeRole === 'Citizen' ? "Enter email or mobile" : "admin@gov.in"} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <input 
                type="password" 
                required 
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-zinc-900 outline-none" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-zinc-900 text-white py-2 rounded-md hover:bg-zinc-800 transition-colors mt-4">
            Sign In
          </button>
        </form>

        {activeRole === 'Citizen' && (
          <p className="text-center text-sm text-zinc-500 mt-6">
            New to the platform? <Link to="/signup" className="text-zinc-900 font-semibold hover:underline">Create an account</Link>
          </p>
        )}
      </div>
    </div>
  );
}