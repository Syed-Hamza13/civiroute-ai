
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Token-based authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Try session-based auth as fallback
      if (req.session && req.session.user) {
        req.user = req.session.user;
        return next();
      }

      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// Session-based middleware (for traditional HTML views)
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

export default authMiddleware;
