
import express from "express";
import path from "path";
import session from "express-session";
import cors from "cors";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import citizenRoutes from "./routes/citizenRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// static
app.use(express.static(path.join(__dirname, "../public")));

// ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// routes
app.use("/", authRoutes);
app.use("/citizen", citizenRoutes);
app.use("/admin", adminRoutes);
app.use("/department", departmentRoutes);
app.use("/complaints", complaintRoutes);

app.get("/", (req, res) => {
  res.redirect("/login");
});

export default app;

