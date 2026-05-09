import db from "../config/db.js";

class Citizen {
  static normalizeMobile(mobile) {
    let cleaned = String(mobile).replace(/\D/g, "");

    if (cleaned.startsWith("91")) {
      cleaned = cleaned.slice(2);
    }

    if (cleaned.length !== 10) {
      throw new Error("Invalid mobile number");
    }

    return `+91${cleaned}`;
  }

  static async create(citizenData) {
    const {
      full_name,
      email,
      mobile,
      password_hash,
      address,
      city_id,
      pincode,
      is_verified = true,
      mobile_verified = true,
    } = citizenData;

    const normalizedMobile = this.normalizeMobile(mobile);

    const query = `
    INSERT INTO citizens (
      full_name,
      email,
      mobile,
      password_hash,
      address,
      city_id,
      pincode,
      is_verified,
      mobile_verified
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const [result] = await db.execute(query, [
      full_name,
      email,
      normalizedMobile,
      password_hash,
      address,
      city_id,
      pincode,
      is_verified,
      mobile_verified,
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
    const normalized = this.normalizeMobile(mobile);

    const [rows] = await db.execute("SELECT * FROM citizens WHERE mobile = ?", [
      normalized,
    ]);

    return rows[0];
  }

  static async findByIdentifier(identifier) {
    let mobile = identifier;

    try {
      mobile = this.normalizeMobile(identifier);
    } catch {
      mobile = identifier;
    }

    const query = `
    SELECT *
    FROM citizens
    WHERE email = ?
    OR mobile = ?
    LIMIT 1
  `;

    const [rows] = await db.execute(query, [identifier, mobile]);

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

  static async verifyMobile(id, mobile) {
    const normalized = this.normalizeMobile(mobile);

    await db.execute(
      `
    UPDATE citizens
    SET mobile = ?,
        mobile_verified = TRUE
    WHERE id = ?
    `,
      [normalized, id],
    );
  }
}

export default Citizen;
