import React, { useState, useEffect } from 'react';
import { 
  Wrench, CheckCircle, Clock, Camera, FileText, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

// ==========================================
// 🔗 DUMMY DATA (Will come from Backend)
// ==========================================
const MOCK_ASSIGNED_COMPLAINTS = [
  { id: 'C-102', title: 'Broken Divider', address: 'Main Square, MP Nagar', urgency: 'Medium', status: 'Assigned', date: '2026-06-04' },
  { id: 'C-105', title: 'Streetlight pole fell down', address: 'Zone 1, Arera Colony', urgency: 'High', status: 'Assigned', date: '2026-06-06' },
  { id: 'C-103', title: 'Road cave-in near market', address: 'New Market', urgency: 'High', status: 'Pending Approval', date: '2026-06-03' },
];

export default function SupervisorDashboard() {
  const [complaints, setComplaints] = useState([]);
  
  // Modal State
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Resolution Form State
  const [resolutionData, setResolutionData] = useState({
    description: '',
    proofImage: null
  });

  // ==========================================
  // 🔗 API CALLS (MOCK IMPLEMENTATION)
  // ==========================================
  
  useEffect(() => {
    // GET: /api/supervisor/complaints
    // Description: Fetches ONLY the complaints assigned to the logged-in supervisor's ID.
    setComplaints(MOCK_ASSIGNED_COMPLAINTS);
  }, []);

  // POST: /api/supervisor/complaints/resolve
  // Description: Submits the proof of work and changes status to 'Pending Approval' for the Dept Head to audit.
  const handleResolveSubmit = (e) => {
    e.preventDefault();
    console.log(`🚀 Submitting Resolution for Ticket ${selectedComplaint.id}`, resolutionData);
    
    // Optimistic UI Update (Mocking Backend Success)
    setComplaints(complaints.map(c => 
      c.id === selectedComplaint.id ? { ...c, status: 'Pending Approval' } : c
    ));
    
    // Reset and Close
    setIsResolveModalOpen(false);
    setResolutionData({ description: '', proofImage: null });
    setSelectedComplaint(null);
  };

  const handleImageUpload = (e) => {
    // Mocking file upload - just storing file object
    setResolutionData({ ...resolutionData, proofImage: e.target.files[0] });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Profile Section */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Ground Supervisor Portal</h1>
          <p className="text-zinc-500 mt-1">Logged in as: <span className="font-semibold text-zinc-800">Raju Mechanic (PWD, Bhopal)</span></p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <Wrench className="h-8 w-8 text-blue-500"/>
            <div>
              <p className="text-sm text-zinc-500">Active Tasks</p>
              <h3 className="text-2xl font-bold">{complaints.filter(c=>c.status === 'Assigned').length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <Clock className="h-8 w-8 text-amber-500"/>
            <div>
              <p className="text-sm text-zinc-500">Pending Verification</p>
              <h3 className="text-2xl font-bold">{complaints.filter(c=>c.status === 'Pending Approval').length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <CheckCircle className="h-8 w-8 text-green-500"/>
            <div>
              <p className="text-sm text-zinc-500">Verified & Closed</p>
              <h3 className="text-2xl font-bold">{complaints.filter(c=>c.status === 'Resolved').length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Worklist (Table) */}
      <Card>
        <CardHeader>
          <CardTitle>My Actionable Worklist</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Issue & Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-zinc-500">No active tasks assigned to you right now.</TableCell>
                </TableRow>
              ) : (
                complaints.map(complaint => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">{complaint.id}</TableCell>
                    <TableCell>
                      <div className="font-medium text-zinc-900">{complaint.title}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                         {complaint.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      {complaint.urgency === 'High' ? (
                        <span className="flex items-center text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded w-fit"><AlertTriangle className="h-3 w-3 mr-1"/> High</span>
                      ) : (
                        <span className="text-yellow-600 text-xs font-semibold bg-yellow-50 px-2 py-1 rounded w-fit">Medium</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {complaint.status === 'Assigned' && <span className="text-blue-600 font-medium text-sm">Action Required</span>}
                      {complaint.status === 'Pending Approval' && <span className="text-amber-600 font-medium text-sm">Waiting for Head</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      {complaint.status === 'Assigned' ? (
                        <Button className="bg-zinc-900 text-white" size="sm" onClick={() => { setSelectedComplaint(complaint); setIsResolveModalOpen(true); }}>
                          <Camera className="mr-2 h-4 w-4" /> Upload Proof
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>Submitted</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* RESOLUTION PROOF MODAL (Closed-Loop Form) */}
      <Dialog open={isResolveModalOpen} onOpenChange={setIsResolveModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Resolution Proof</DialogTitle>
            <DialogDescription>
              Provide photo evidence and a brief description of the work done for Ticket: <strong>{selectedComplaint?.id}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleResolveSubmit} className="space-y-5 py-4">
            
            {/* Image Upload Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Camera className="h-4 w-4 text-zinc-500"/> Upload Photo Proof (After Fix)</label>
              <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-zinc-50 hover:bg-zinc-100 transition-colors">
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  id="proof-upload" 
                  onChange={handleImageUpload} 
                  required
                />
                <label htmlFor="proof-upload" className="cursor-pointer flex flex-col items-center">
                  <Camera className="h-8 w-8 text-zinc-400 mb-2" />
                  <span className="text-sm font-medium text-zinc-900">
                    {resolutionData.proofImage ? resolutionData.proofImage.name : "Click to upload image"}
                  </span>
                  <span className="text-xs text-zinc-500 mt-1">JPEG, PNG up to 5MB</span>
                </label>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><FileText className="h-4 w-4 text-zinc-500"/> Work Description</label>
              <textarea 
                required
                rows="3"
                className="w-full p-3 border border-zinc-200 rounded-md outline-none focus:ring-2 focus:ring-zinc-900 resize-none text-sm"
                placeholder="Briefly describe what was fixed (e.g., 'Filled the pothole with 2 bags of concrete...')"
                value={resolutionData.description}
                onChange={(e) => setResolutionData({...resolutionData, description: e.target.value})}
              />
            </div>

            {/* Action Buttons (Vertically Aligned if on small screen, horizontally on normal) */}
            <div className="flex flex-col gap-3 pt-2">
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Submit & Request Approval
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => setIsResolveModalOpen(false)}>
                Cancel
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}