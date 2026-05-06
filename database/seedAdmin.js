
import bcrypt from "bcrypt";
import db from "../src/config/db.js";

async function seedSuperAdmin() {
  try {
    const full_name = "Super Admin";
    const email = "admin@civiroute.com";
    const username = "admin";
    const password = "admin123";

    // hash password
    const password_hash = await bcrypt.hash(password, 10);

    // insert query
    const query = `
      INSERT INTO super_admins (
        full_name,
        email,
        username,
        password_hash
      )
      VALUES (?, ?, ?, ?)
    `;

    await db.execute(query, [
      full_name,
      email,
      username,
      password_hash,
    ]);

    console.log("✅ Super Admin Created Successfully");

    console.log({
      email,
      username,
      password,
    });

    process.exit(0);

  } catch (error) {
    console.error("❌ Failed to create super admin");
    console.error(error.message);

    process.exit(1);
  }
}

seedSuperAdmin();