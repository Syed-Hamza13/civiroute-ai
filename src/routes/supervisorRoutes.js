import express from "express";

import path from "path";

import { rootDir } from "../app.js";
import { requireSupervisor } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  requireSupervisor,
  (req, res) => {
    // LOGIN CHECK
    if (!req.session.user) {
      return res.redirect("/login");
    }

    // ROLE CHECK
    if (req.session.user.role !== "supervisor") {
      return res.status(403).send("Forbidden");
    }

    res.sendFile(path.join(rootDir, "views/supervisor/dashboard.html"));
  },
);

export default router;
