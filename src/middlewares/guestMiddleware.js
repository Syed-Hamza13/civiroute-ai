
export default function guestOnly(
  req,
  res,
  next
) {
  if (!req.session.user) {
    return next();
  }

  const role = req.session.user.role;
  const userSession = req.session;
  console.log("role : ", role);
  console.log("User session in guestOnly middleware:", userSession);

  if (role === "admin") {
    return res.redirect("/admin/dashboard");
  }

  if (role === "citizen") {
    return res.redirect("/citizen/dashboard");
  }

  if (role === "department") {
    return res.redirect("/department/dashboard");
  }

  next();
}
