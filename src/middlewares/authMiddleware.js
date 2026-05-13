
export function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  next();
}

export function requireCitizen(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.role !== "citizen") {
    return res.status(403).send("Forbidden");
  }

  next();
}

export function requireDepartment(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.role !== "department") {
    return res.status(403).send("Forbidden");
  }

  next();
}

export function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.role !== "admin") {
    return res.status(403).send("Forbidden");
  }

  next();
}

export function requireSupervisor(req, res, next) {

  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.role !== "supervisor") {
    return res.status(403).send("Forbidden");
  }

  next();
}
