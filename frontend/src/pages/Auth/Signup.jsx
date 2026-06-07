import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, Mail, Phone, Lock, Home } from 'lucide-react';

// Mock Geo-Fence Data (Later will come from backend)
const availableLocations = {
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"]
};

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', address: '', state: '', city: '', pincode: '', password: '', confirmPassword: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Citizen Signup Payload:", formData);
    // API Call goes here
    navigate('/citizen/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full p-8 rounded-xl shadow-sm border border-zinc-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Citizen Registration</h1>
          <p className="text-zinc-500 mt-2">Join the Smart Grievance Network for your city</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <input type="text" name="name" onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="John Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <input type="tel" name="mobile" onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="9876543210" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <input type="email" name="email" onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Address</label>
              <div className="relative">
                <Home className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <input type="text" name="address" onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="House No, Street" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">State (Geo-fenced)</label>
              <select name="state" onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-zinc-900 outline-none">
                <option value="">Select State</option>
                {Object.keys(availableLocations).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <select name="city" onChange={handleChange} disabled={!formData.state} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-zinc-900 outline-none disabled:bg-zinc-100">
                <option value="">Select City</option>
                {formData.state && availableLocations[formData.state].map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pincode</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <input type="text" name="pincode" onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="462001" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <input type="password" name="password" onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="••••••••" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <input type="password" name="confirmPassword" onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="••••••••" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-zinc-900 text-white py-2 rounded-md hover:bg-zinc-800 transition-colors">
            Register Account
          </button>
        </form>
        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account? <Link to="/login" className="text-zinc-900 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}