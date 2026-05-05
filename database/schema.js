
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import db  from "../src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSchema() {
  try {
    console.log("Running schema...");

    const sql = await fs.readFile(
      path.join(__dirname, "schema.sql"),
      "utf-8"
    );

    const statements = sql
      .split(";")
      .map((q) => q.trim())
      .filter(Boolean);

    for (const query of statements) {
      await db.query(query);
    }

    console.log("Schema executed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Schema failed:", error.message);
    process.exit(1);
  }
}

runSchema();
