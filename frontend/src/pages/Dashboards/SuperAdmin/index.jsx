import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, MapPin, Plus, Trash2, Mail, Phone 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

// ==========================================
// 🔗 DUMMY DATA & STATE OPTIONS (Will come from Backend)
// ==========================================
const MOCK_DEPARTMENTS = [
  { id: 1, state: "Madhya Pradesh", city: "Bhopal", deptName: "PWD", headName: "Ramesh Kumar", email: "ramesh.pwd@gov.in", mobile: "9876543210" },
  { id: 2, state: "Madhya Pradesh", city: "Indore", deptName: "Water", headName: "Sunita Sharma", email: "sunita.water@gov.in", mobile: "8765432109" }
];

const AVAILABLE_STATES = ["Madhya Pradesh", "Maharashtra", "Delhi"];
const CITIES_BY_STATE = {
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi"]
};
const DEPT_TYPES = ["Water", "PWD", "Electricity", "Roads", "Sanitation"];

export default function SuperAdminDashboard() {
  const [departments, setDepartments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // 👉 CHANGE 1: Added password & retypePassword in state
  const [formData, setFormData] = useState({
    state: '', city: '', pincode: '', deptName: '', headName: '', mobile: '', email: '', password: '', retypePassword: ''
  });

  // ==========================================
  // 🔗 API CALLS (MOCK IMPLEMENTATION)
  // ==========================================
  
  useEffect(() => {
    setDepartments(MOCK_DEPARTMENTS);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateDeptHead = (e) => {
    e.preventDefault();
    
    // 👉 CHANGE 2: Added validation for password matching
    if (formData.password !== formData.retypePassword) {
      alert("Passwords do not match! Please check again.");
      return;
    }

    console.log("🚀 Payload going to Backend:", formData);
    
    const newEntry = { ...formData, id: Math.random() };
    setDepartments([...departments, newEntry]);
    setIsDialogOpen(false); 
    // 👉 CHANGE 3: Resetting new fields
    setFormData({ state: '', city: '', pincode: '', deptName: '', headName: '', mobile: '', email: '', password: '', retypePassword: '' }); 
  };

  const handleDelete = (id) => {
    console.log("🗑️ Deleting ID from Backend:", id);
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Super Admin Portal</h1>
          <p className="text-zinc-500">Manage client municipalities, states, and department heads.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-900 text-white">
              <Plus className="mr-2 h-4 w-4" /> Onboard Department
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Onboard New Department Head</DialogTitle>
              <DialogDescription>
                Create a new administrative account for a municipality department.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateDeptHead} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <select name="state" value={formData.state} onChange={handleInputChange} required className="w-full p-2 border rounded-md outline-none">
                    <option value="">Select State</option>
                    {AVAILABLE_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <select name="city" value={formData.city} onChange={handleInputChange} required disabled={!formData.state} className="w-full p-2 border rounded-md outline-none disabled:bg-zinc-100">
                    <option value="">Select City</option>
                    {formData.state && CITIES_BY_STATE[formData.state]?.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Pincode</label>
                  <Input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required placeholder="e.g. 462001" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Department Type</label>
                  <select name="deptName" value={formData.deptName} onChange={handleInputChange} required className="w-full p-2 border rounded-md outline-none">
                    <option value="">Select Department</option>
                    {DEPT_TYPES.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
              </div>

              <div className="border-t my-4 pt-4">
                <h4 className="text-sm font-semibold mb-4 text-zinc-700">Head Official Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Official's Name</label>
                    <Input type="text" name="headName" value={formData.headName} onChange={handleInputChange} required placeholder="Full Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mobile Number</label>
                    <Input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required placeholder="10-digit number" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Official Email (Used for Login)</label>
                    <Input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="admin@department.gov.in" />
                  </div>
                  
                  {/* 👉 CHANGE 4: Added Password & Confirm Password Fields here */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Set Password</label>
                    <Input type="password" name="password" value={formData.password} onChange={handleInputChange} required placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <Input type="password" name="retypePassword" value={formData.retypePassword} onChange={handleInputChange} required placeholder="••••••••" />
                  </div>

                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="w-full">Create Account</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-zinc-500">Active States</CardTitle><MapPin className="h-4 w-4 text-zinc-400" /></CardHeader><CardContent><div className="text-2xl font-bold">3</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-zinc-500">Total Departments</CardTitle><Building2 className="h-4 w-4 text-zinc-400" /></CardHeader><CardContent><div className="text-2xl font-bold">{departments.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-zinc-500">Active Officials</CardTitle><Users className="h-4 w-4 text-zinc-400" /></CardHeader><CardContent><div className="text-2xl font-bold">{departments.length}</div></CardContent></Card>
      </div>

      {/* Data Table Section */}
      <Card>
        <CardHeader><CardTitle>Onboarded Department Heads</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Department</TableHead><TableHead>Location</TableHead><TableHead>Head Official</TableHead><TableHead>Contact Info</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-6 text-zinc-500">No departments found. Add one to get started.</TableCell></TableRow>
              ) : (
                departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium"><div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-zinc-400" />{dept.deptName}</div></TableCell>
                    <TableCell>{dept.city}, {dept.state}</TableCell>
                    <TableCell>{dept.headName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm text-zinc-500">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3"/> {dept.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3"/> {dept.mobile}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}