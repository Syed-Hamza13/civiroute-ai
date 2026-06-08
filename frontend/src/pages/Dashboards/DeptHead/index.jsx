import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, UserCheck, Users, AlertTriangle, 
  CheckCircle, Clock, Plus, Eye, UserPlus
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
// 🔗 DUMMY DATA (Will come from Backend)
// ==========================================
const MOCK_SUPERVISORS = [
  { id: 'sup_1', name: 'Raju Mechanic', mobile: '9988776655', email: 'raju@pwd.gov.in' },
  { id: 'sup_2', name: 'Vikram Singh', mobile: '8877665544', email: 'vikram@pwd.gov.in' }
];

const MOCK_COMPLAINTS = [
  { id: 'C-101', title: 'Huge Pothole on MG Road', urgency: 'High', status: 'Pending', date: '2026-06-05', desc: 'A very deep pothole causing traffic jams.' },
  { id: 'C-102', title: 'Broken Divider', urgency: 'Medium', status: 'Assigned', assignedTo: 'Raju Mechanic', date: '2026-06-04' },
  { 
    id: 'C-103', title: 'Road cave-in near market', urgency: 'High', status: 'Pending Approval', assignedTo: 'Vikram Singh', date: '2026-06-03',
    resolution: { desc: 'Filled the cave-in with concrete and leveled the road.', image: 'https://via.placeholder.com/400x200?text=Resolution+Proof+Image' }
  }
];

export default function DeptHeadDashboard() {
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox', 'audit', 'supervisors'
  const [complaints, setComplaints] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  
  // Modals State
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');

  // Supervisor Form State (Notice the new retypePassword field)
  const [supFormData, setSupFormData] = useState({ name: '', mobile: '', email: '', password: '', retypePassword: '' });

  // ==========================================
  // 🔗 API CALLS (MOCK IMPLEMENTATION)
  // ==========================================
  
  useEffect(() => {
    // GET: /api/depthead/complaints & /api/depthead/supervisors
    setComplaints(MOCK_COMPLAINTS);
    setSupervisors(MOCK_SUPERVISORS);
  }, []);

  // POST: /api/depthead/supervisors
  const handleCreateSupervisor = (e) => {
    e.preventDefault();
    
    // YAHAN VALIDATION ADD KIYA HAI
    if (supFormData.password !== supFormData.retypePassword) {
      alert("Passwords do not match! Please check again.");
      return;
    }

    console.log("🚀 Creating Supervisor (Backend will auto-inject State/City/Dept from token):", supFormData);
    const newSup = { ...supFormData, id: `sup_${Math.random()}` };
    setSupervisors([...supervisors, newSup]);
    setIsSupervisorModalOpen(false);
    // Resetting including the new field
    setSupFormData({ name: '', mobile: '', email: '', password: '', retypePassword: '' });
  };

  // PATCH: /api/depthead/complaints/assign
  const handleAssignTicket = () => {
    console.log(`🚀 Assigning Ticket ${selectedComplaint.id} to Supervisor ID: ${selectedSupervisor}`);
    setComplaints(complaints.map(c => 
      c.id === selectedComplaint.id ? { ...c, status: 'Assigned', assignedTo: supervisors.find(s => s.id === selectedSupervisor).name } : c
    ));
    setIsAssignModalOpen(false);
    setSelectedSupervisor('');
  };

  // PATCH: /api/depthead/complaints/approve
  const handleAuditAction = (action) => { 
    console.log(`🚀 ${action}ing Resolution for Ticket: ${selectedComplaint.id}`);
    const newStatus = action === 'Approve' ? 'Resolved' : 'Assigned'; 
    setComplaints(complaints.map(c => 
      c.id === selectedComplaint.id ? { ...c, status: newStatus } : c
    ));
    setIsAuditModalOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Profile Section */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Department Dashboard</h1>
          <p className="text-zinc-500 mt-1">Logged in as: <span className="font-semibold text-zinc-800">Head of PWD, Bhopal (MP)</span></p>
        </div>
        
        {/* CREATE SUPERVISOR BUTTON & MODAL */}
        <Dialog open={isSupervisorModalOpen} onOpenChange={setIsSupervisorModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-900"><UserPlus className="mr-2 h-4 w-4" /> Add Supervisor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Supervisor Account</DialogTitle>
              <DialogDescription>
                State, City, and Department will be automatically inherited from your profile.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSupervisor} className="space-y-4 mt-2">
              <Input placeholder="Full Name" value={supFormData.name} onChange={(e) => setSupFormData({...supFormData, name: e.target.value})} required />
              <Input type="tel" placeholder="Mobile Number" value={supFormData.mobile} onChange={(e) => setSupFormData({...supFormData, mobile: e.target.value})} required />
              <Input type="email" placeholder="Email Address" value={supFormData.email} onChange={(e) => setSupFormData({...supFormData, email: e.target.value})} required />
              
              {/* YAHAN PASSWORD FIELDS KO SIDE-BY-SIDE KIYA HAI */}
              <div className="grid grid-cols-2 gap-4">
                <Input type="password" placeholder="Temporary Password" value={supFormData.password} onChange={(e) => setSupFormData({...supFormData, password: e.target.value})} required />
                <Input type="password" placeholder="Retype Password" value={supFormData.retypePassword} onChange={(e) => setSupFormData({...supFormData, retypePassword: e.target.value})} required />
              </div>
              
              <Button type="submit" className="w-full">Create Account</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-4"><AlertTriangle className="h-8 w-8 text-red-500"/><div><p className="text-sm text-zinc-500">New / Unassigned</p><h3 className="text-2xl font-bold">{complaints.filter(c=>c.status === 'Pending').length}</h3></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4"><Clock className="h-8 w-8 text-blue-500"/><div><p className="text-sm text-zinc-500">In Progress</p><h3 className="text-2xl font-bold">{complaints.filter(c=>c.status === 'Assigned').length}</h3></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4"><UserCheck className="h-8 w-8 text-amber-500"/><div><p className="text-sm text-zinc-500">Pending Approval</p><h3 className="text-2xl font-bold">{complaints.filter(c=>c.status === 'Pending Approval').length}</h3></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4"><CheckCircle className="h-8 w-8 text-green-500"/><div><p className="text-sm text-zinc-500">Resolved</p><h3 className="text-2xl font-bold">{complaints.filter(c=>c.status === 'Resolved').length}</h3></div></CardContent></Card>
      </div>

      {/* Custom Tabs Navigation */}
      <div className="flex space-x-2 border-b">
        <button onClick={() => setActiveTab('inbox')} className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'inbox' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>Inbox & Assignments</button>
        <button onClick={() => setActiveTab('audit')} className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'audit' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>Audit Loop (Approvals)</button>
        <button onClick={() => setActiveTab('supervisors')} className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'supervisors' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>Manage Supervisors</button>
      </div>

      {/* TAB 1: INBOX & ASSIGNMENTS */}
      {activeTab === 'inbox' && (
        <Card>
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Title</TableHead><TableHead>Urgency</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {complaints.filter(c => ['Pending', 'Assigned'].includes(c.status)).map(complaint => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.id}</TableCell>
                  <TableCell>{complaint.title}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded text-xs font-medium ${complaint.urgency === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{complaint.urgency}</span></TableCell>
                  <TableCell>{complaint.status === 'Assigned' ? `Assigned to ${complaint.assignedTo}` : 'Unassigned'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => { setSelectedComplaint(complaint); setIsAssignModalOpen(true); }}>
                      {complaint.status === 'Pending' ? 'Assign Ticket' : 'Re-Assign'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* ASSIGN TICKET MODAL */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Ticket to Supervisor</DialogTitle><DialogDescription>Ticket: {selectedComplaint?.title}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <select className="w-full p-2 border rounded-md" value={selectedSupervisor} onChange={(e) => setSelectedSupervisor(e.target.value)}>
              <option value="">-- Select a Supervisor --</option>
              {supervisors.map(sup => <option key={sup.id} value={sup.id}>{sup.name} ({sup.mobile})</option>)}
            </select>
            <Button onClick={handleAssignTicket} disabled={!selectedSupervisor} className="w-full">Confirm Assignment</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* TAB 2: AUDIT LOOP (PENDING APPROVALS) */}
      {activeTab === 'audit' && (
        <Card>
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Issue</TableHead><TableHead>Fixed By</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {complaints.filter(c => c.status === 'Pending Approval').map(complaint => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.id}</TableCell>
                  <TableCell>{complaint.title}</TableCell>
                  <TableCell>{complaint.assignedTo}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600" onClick={() => { setSelectedComplaint(complaint); setIsAuditModalOpen(true); }}>
                      <Eye className="mr-2 h-4 w-4"/> Review Proof
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {complaints.filter(c => c.status === 'Pending Approval').length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center py-6 text-zinc-500">No tickets pending approval.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* AUDIT MODAL */}
      <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Audit Resolution Proof</DialogTitle><DialogDescription>Ticket: {selectedComplaint?.id} - {selectedComplaint?.title}</DialogDescription></DialogHeader>
          {selectedComplaint?.resolution && (
            <div className="space-y-4">
              <div className="bg-zinc-50 p-3 rounded-md border text-sm"><strong>Supervisor Notes:</strong> {selectedComplaint.resolution.desc}</div>
              <div className="border rounded-md overflow-hidden">
                <img src={selectedComplaint.resolution.image} alt="Proof" className="w-full h-48 object-cover" />
              </div>
              <div className="flex flex-col gap-4 pt-4">
                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleAuditAction('Reject')}>Reject (Re-assign)</Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAuditAction('Approve')}>Approve & Close Ticket</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* TAB 3: SUPERVISORS LIST */}
      {activeTab === 'supervisors' && (
        <Card>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Mobile</TableHead><TableHead>Email</TableHead></TableRow></TableHeader>
            <TableBody>
              {supervisors.map(sup => (
                <TableRow key={sup.id}>
                  <TableCell className="font-medium flex items-center gap-2"><Users className="h-4 w-4 text-zinc-400"/> {sup.name}</TableCell>
                  <TableCell>{sup.mobile}</TableCell>
                  <TableCell>{sup.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}