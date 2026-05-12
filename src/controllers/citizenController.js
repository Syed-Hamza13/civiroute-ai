// import { json } from "express";

// let complaintList = []; // In-memory storage for complaints
// export async function submitComplaint(req, res) {
    
//   const complaint = req.body;
//   const complaintHeaders = req.headers;
//   const citizenSession = req.session // Assuming user ID is available in req.user
//   const citizenId = req.session.user.id // Assuming user ID is available in req.user


//   console.log("complaint received :", complaint.complaint);
//   console.log("complaint headers :",  complaintHeaders);
//   console.log("citizen session :", citizenSession);
//   console.log("citizen Id :", citizenId);

//   complaintList.push(complaint)
//   console.log("Current complaints list:", complaintList);


//   res.status(200).json({
//     success: true,
//     message: "Complaint submitted successfully"
//   });
// }

// export async function myComplaints(req, res) {
//   // const citizenId = req.session.user.id; // Assuming user ID is available in req.user
//   // const userComplaints = complaintList.filter(complaint => complaint.citizenId === citizenId);

//   res.json({
//     success: true,
//     body : json.stringify(complaintList) // Return all complaints for now, can be filtered by citizenId in future
//   });
// }


let complaintList = [];

export async function submitComplaint(req, res) {

  const complaint = req.body;

  complaintList.push({
    complaint: complaint.complaint,
    status: "Pending"
  });

  console.log("Current complaints list:", complaintList);

  res.status(200).json({
    success: true,
    message: "Complaint submitted successfully"
  });
}

export async function myComplaints(req, res) {

  res.json({
    success: true,
    complaints: complaintList
  });
}


