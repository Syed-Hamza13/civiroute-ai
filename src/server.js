
import dotenv from "dotenv";
import app from "./app.js";
import db from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

try {
  await db.query("SELECT 1");
  console.log("✅ MySQL Connected");

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("❌ Database Connection Failed:", error.message);
}

