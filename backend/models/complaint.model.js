const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  // Basic Grievance Info (Filed by Citizen)
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  citizenId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  supportingDocs: [{ 
    type: String // Arrays of URLs (Images/PDFs) uploaded by citizen
  }],

  // Geolocation Mapping (Auto-inherited from Citizen's profile)
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },

  // AI Analysis Results (Mocked for now)
  aiAnalysis: {
    predictedDepartment: { type: String }, // e.g., 'PWD', 'Water'
    confidenceScore: { type: Number },     // e.g., 0.95
    urgency: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Pending AI Analysis'], 
      default: 'Pending AI Analysis' 
    }
  },

  // Routing & Assignment Workflow
  assignedDepartment: { 
    type: String // Set by AI, used by DeptHead to filter inbox
  },
  assignedSupervisorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Assigned', 'Pending Approval', 'Resolved', 'Rejected'], 
    default: 'Pending' 
  },

  // Closed-Loop Resolution Audit (Submitted by Supervisor)
  resolutionDetails: {
    description: { type: String },
    proofImages: [{ type: String }], // Array of URLs of resolved work
    submittedAt: { type: Date }
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Complaint', complaintSchema);