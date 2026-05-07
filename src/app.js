
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import session from "express-session";
import { RedisStore } from "connect-redis";
import redisClient from "./config/redis.js";

import dotenv from "dotenv"; 

import authRoutes from "./routes/authRoutes.js";
import citizenRoutes from "./routes/citizenRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootDir = __dirname;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    store: new RedisStore({
      client: redisClient
    }),

    name: "civiroute.sid",

    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    rolling: true,

    cookie: {
      httpOnly: true,
      secure: false, // true in HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);


// static
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use("/", authRoutes);
app.use("/citizen", citizenRoutes);
app.use("/admin", adminRoutes);
app.use("/department", departmentRoutes);
app.use("/complaints", complaintRoutes);
app.use("/ai", aiRoutes);

export default app;
