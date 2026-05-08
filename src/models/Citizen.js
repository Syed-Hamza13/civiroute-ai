import db from "../config/db.js";

class Citizen {
  static async create(citizenData) {
    const {
      full_name,
      email,
      mobile,
      password_hash,
      address,
      city_id,
      pincode,
    } = citizenData;

    const query = `
      INSERT INTO citizens (
        full_name,
        email,
        mobile,
        password_hash,
        address,
        city_id,
        pincode
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      full_name,
      email,
      mobile,
      password_hash,
      address,
      city_id,
      pincode,
    ]);

    return result;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM citizens WHERE email = ?", [
      email,
    ]);

    return rows[0];
  }

  static async findByMobile(mobile) {
    const [rows] = await db.execute("SELECT * FROM citizens WHERE mobile = ?", [
      mobile,
    ]);

    return rows[0];
  }

  static async findByIdentifier(identifier) {
    const query = `
    SELECT *
    FROM citizens
    WHERE email = ? OR mobile = ?
    LIMIT 1
  `;

    const [rows] = await db.execute(query, [identifier, identifier]);

    return rows[0];
  }

  static async verifyEmail(id) {
    await db.execute(
      `
    UPDATE citizens
    SET is_verified = TRUE
    WHERE id = ?
    `,
      [id],
    );
  }
}

export default Citizen;
