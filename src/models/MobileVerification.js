
import db from "../config/db.js";

class MobileVerification {
  static async create(phone, otp) {
    await db.execute(
      `
      INSERT INTO mobile_verifications
      (
        phone,
        otp,
        expires_at
      )
      VALUES
      (
        ?,
        ?,
        DATE_ADD(NOW(), INTERVAL 10 MINUTE)
      )
      `,
      [phone, otp]
    );
  }

  static async verify(phone, otp) {
    const [rows] =
      await db.execute(
        `
        SELECT *
        FROM mobile_verifications
        WHERE phone = ?
        AND otp = ?
        AND verified = FALSE
        AND expires_at > NOW()
        ORDER BY id DESC
        LIMIT 1
        `,
        [phone, otp]
      );

    return rows[0];
  }

  static async markVerified(id) {
    await db.execute(
      `
      UPDATE mobile_verifications
      SET verified = TRUE
      WHERE id = ?
      `,
      [id]
    );
  }
}

export default MobileVerification;
