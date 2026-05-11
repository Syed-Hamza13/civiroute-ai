export async function submitComplaint(req, res) {
    
  const complaint = req.body;
  const complaintHeaders = req.headers;
  const citizenSession = req.session // Assuming user ID is available in req.user
  const citizenId = req.session.user.id // Assuming user ID is available in req.user


  console.log("complaint received :", complaint);
  console.log("complaint headers :",  complaintHeaders);
  console.log("citizen session :", citizenSession);
  console.log("citizen Id :", citizenId);


  res.status(200).json({
    success: true,
    message: "Complaint submitted successfully"
  });
}
