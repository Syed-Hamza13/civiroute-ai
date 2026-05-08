
import db from "../config/db.js";

class EmailVerification {
  static async create(citizenId, otp) {
    const query = `
      INSERT INTO email_verifications
      (
        citizen_id,
        otp,
        expires_at
      )
      VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
    `;

    await db.execute(query, [
      citizenId,
      otp
    ]);
  }

  static async verify(citizenId, otp) {
    const query = `
      SELECT *
      FROM email_verifications
      WHERE citizen_id = ?
      AND otp = ?
      AND verified = FALSE
      AND expires_at > NOW()
      ORDER BY id DESC
      LIMIT 1
    `;

    const [rows] = await db.execute(
      query,
      [citizenId, otp]
    );

    return rows[0];
  }

  static async markVerified(id) {
    await db.execute(
      `
      UPDATE email_verifications
      SET verified = TRUE
      WHERE id = ?
      `,
      [id]
    );
  }
}

export default EmailVerification;
