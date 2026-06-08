import React, { useState, useEffect } from 'react';
import { 
  FileText, PlusCircle, Clock, CheckCircle, AlertCircle, 
  MapPin, UploadCloud, Eye, Info
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
const MOCK_MY_COMPLAINTS = [
  { 
    id: 'C-101', 
    title: 'Huge Pothole on MG Road', 
    desc: 'There is a deep pothole causing traffic issues near the square.',
    aiDepartment: 'PWD',
    urgency: 'High', 
    status: 'Resolved', 
    date: '2026-06-01',
    resolution: {
      desc: 'Filled the pothole with concrete and leveled the road surface.',
      image: 'https://via.placeholder.com/400x200?text=Resolved+Pothole',
      resolvedAt: '2026-06-05'
    }
  },
  { 
    id: 'C-108', 
    title: 'No water supply for 2 days', 
    desc: 'Our entire sector has not received water since yesterday morning.',
    aiDepartment: 'Water',
    urgency: 'High', 
    status: 'Pending', 
    date: '2026-06-08' 
  },
  { 
    id: 'C-109', 
    title: 'Streetlight not working', 
    desc: 'The streetlight outside house no 45 is broken.',
    aiDepartment: 'Electricity',
    urgency: 'Low', 
    status: 'Assigned', 
    date: '2026-06-07' 
  }
];

export default function CitizenDashboard() {
  const [complaints, setComplaints] = useState([]);
  
  // Modals State
  const [isLodgeModalOpen, setIsLodgeModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // New Complaint Form State
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    document: null
  });

  const [isSimulatingAI, setIsSimulatingAI] = useState(false);

  // ==========================================
  // 🔗 API CALLS (MOCK IMPLEMENTATION)
  // ==========================================
  
  useEffect(() => {
    // GET: /api/citizen/complaints
    // Description: Fetch all complaints filed by the currently logged-in citizen.
    setComplaints(MOCK_MY_COMPLAINTS);
  }, []);

  // POST: /api/citizen/complaints
  // Description: Submits grievance text/images. Backend AI will analyze the text, 
  // assign 'predictedDepartment' and 'urgency', and route it to the DeptHead inbox.
  const handleLodgeComplaint = (e) => {
    e.preventDefault();
    setIsSimulatingAI(true);
    console.log("🚀 Submitting Grievance Payload to Backend:", newComplaint);

    // Simulating backend AI processing time
    setTimeout(() => {
      const mockBackendResponse = {
        id: `C-${Math.floor(Math.random() * 900) + 100}`,
        title: newComplaint.title,
        desc: newComplaint.description,
        aiDepartment: 'AI Processed (Auto-Routed)', // Backend BERT model will replace this
        urgency: 'Pending AI Analysis', 
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      };
      
      setComplaints([mockBackendResponse, ...complaints]);
      setIsSimulatingAI(false);
      setIsLodgeModalOpen(false);
      setNewComplaint({ title: '', description: '', document: null });
    }, 1500);
  };

  const handleFileUpload = (e) => {
    setNewComplaint({ ...newComplaint, document: e.target.files[0] });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Profile Section */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Citizen Portal</h1>
          <p className="text-zinc-500 mt-1">Welcome back, <span className="font-semibold text-zinc-800">Meer (Bhopal, MP)</span></p>
        </div>
        
        {/* LODGE GRIEVANCE BUTTON */}
        <Dialog open={isLodgeModalOpen} onOpenChange={setIsLodgeModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-900"><PlusCircle className="mr-2 h-4 w-4" /> Lodge New Complaint</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Smart Grievance Form</DialogTitle>
              <DialogDescription>
                Describe your issue. Our AI will automatically categorize it and route it to the correct local department.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLodgeComplaint} className="space-y-5 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Problem Title</label>
                <Input 
                  placeholder="e.g., Broken water pipe causing flooding" 
                  value={newComplaint.title} 
                  onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Detailed Description</label>
                <textarea 
                  required
                  rows="4"
                  className="w-full p-3 border border-zinc-200 rounded-md outline-none focus:ring-2 focus:ring-zinc-900 resize-none text-sm"
                  placeholder="Please provide details. The AI uses this to understand the urgency and department..."
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Supporting Documents (Optional)</label>
                <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 flex flex-col items-center text-center bg-zinc-50 hover:bg-zinc-100 transition-colors">
                  <Input type="file" accept="image/*,.pdf" className="hidden" id="citizen-upload" onChange={handleFileUpload} />
                  <label htmlFor="citizen-upload" className="cursor-pointer flex flex-col items-center">
                    <UploadCloud className="h-8 w-8 text-zinc-400 mb-2" />
                    <span className="text-sm font-medium text-zinc-900">
                      {newComplaint.document ? newComplaint.document.name : "Upload Image or PDF"}
                    </span>
                    <span className="text-xs text-zinc-500 mt-1">Max file size: 5MB</span>
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={isSimulatingAI} className="w-full">
                {isSimulatingAI ? 'AI is Analyzing & Routing...' : 'Submit Grievance'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-4"><FileText className="h-8 w-8 text-blue-500"/><div><p className="text-sm text-zinc-500">Total Filed</p><h3 className="text-2xl font-bold">{complaints.length}</h3></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4"><Clock className="h-8 w-8 text-amber-500"/><div><p className="text-sm text-zinc-500">In Progress / Pending</p><h3 className="text-2xl font-bold">{complaints.filter(c => c.status !== 'Resolved').length}</h3></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4"><CheckCircle className="h-8 w-8 text-green-500"/><div><p className="text-sm text-zinc-500">Resolved</p><h3 className="text-2xl font-bold">{complaints.filter(c => c.status === 'Resolved').length}</h3></div></CardContent></Card>
      </div>

      {/* Complaint History Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Complaint History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Issue Title</TableHead>
                <TableHead>Routed Dept (AI)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tracking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-zinc-500">You haven't lodged any complaints yet.</TableCell>
                </TableRow>
              ) : (
                complaints.map(complaint => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">{complaint.id}</TableCell>
                    <TableCell>
                      <div className="font-medium text-zinc-900">{complaint.title}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> Filed on: {complaint.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-xs font-medium">
                        {complaint.aiDepartment}
                      </span>
                    </TableCell>
                    <TableCell>
                      {complaint.status === 'Pending' && <span className="text-zinc-600 font-medium text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> Queued</span>}
                      {complaint.status === 'Assigned' && <span className="text-blue-600 font-medium text-sm flex items-center"><Clock className="w-4 h-4 mr-1"/> In Progress</span>}
                      {complaint.status === 'Pending Approval' && <span className="text-amber-600 font-medium text-sm flex items-center"><Eye className="w-4 h-4 mr-1"/> Auditing Fix</span>}
                      {complaint.status === 'Resolved' && <span className="text-green-600 font-medium text-sm flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Resolved</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedComplaint(complaint); setIsViewModalOpen(true); }}>
                        Track Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* TRACKING & RESOLUTION MODAL */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ticket Lifecycle: {selectedComplaint?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedComplaint && (
            <div className="space-y-6 py-2">
              
              {/* If Resolved, show the Banner & Proof */}
              {selectedComplaint.status === 'Resolved' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-green-800 font-bold">
                    <CheckCircle className="h-5 w-5" /> Problem Successfully Resolved
                  </div>
                  <div className="text-sm text-green-700 bg-white p-3 rounded border border-green-100">
                    <strong>Official Remarks:</strong> {selectedComplaint.resolution.desc}
                  </div>
                  <div className="border border-green-200 rounded overflow-hidden">
                     <img src={selectedComplaint.resolution.image} alt="Resolution" className="w-full h-40 object-cover" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-zinc-900 border-b pb-1">Original Grievance</h4>
                <p className="text-sm text-zinc-600 font-medium">{selectedComplaint.title}</p>
                <p className="text-sm text-zinc-500 bg-zinc-50 p-2 rounded border">{selectedComplaint.desc}</p>
              </div>

              {/* Lifecycle Tracker */}
              <div className="space-y-2">
                 <h4 className="text-sm font-semibold text-zinc-900 border-b pb-1">Status Timeline</h4>
                 <ul className="space-y-3 text-sm pt-2 relative border-l-2 border-zinc-200 ml-2 pl-4">
                    <li className="relative">
                      <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-zinc-400 border-2 border-white"></span>
                      <span className="font-medium text-zinc-900">Complaint Lodged</span>
                      <p className="text-xs text-zinc-500">Date: {selectedComplaint.date}</p>
                    </li>
                    <li className="relative">
                      <span className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white ${['Assigned', 'Pending Approval', 'Resolved'].includes(selectedComplaint.status) ? 'bg-blue-500' : 'bg-zinc-200'}`}></span>
                      <span className={`font-medium ${['Assigned', 'Pending Approval', 'Resolved'].includes(selectedComplaint.status) ? 'text-zinc-900' : 'text-zinc-400'}`}>Assigned to Officer</span>
                    </li>
                    <li className="relative">
                      <span className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white ${selectedComplaint.status === 'Resolved' ? 'bg-green-500' : 'bg-zinc-200'}`}></span>
                      <span className={`font-medium ${selectedComplaint.status === 'Resolved' ? 'text-zinc-900' : 'text-zinc-400'}`}>Closed & Verified by Dept. Head</span>
                    </li>
                 </ul>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}