
import db from "../config/db.js";

class MobileVerification {

  static async create(
    citizenId,
    otp
  ) {
    await db.execute(
      `
      INSERT INTO mobile_verifications
      (
        citizen_id,
        otp,
        expires_at
      )
      VALUES
      (
        ?,
        ?,
        DATE_ADD(
          NOW(),
          INTERVAL 10 MINUTE
        )
      )
      `,
      [citizenId, otp]
    );
  }

  static async verify(
    citizenId,
    otp
  ) {
    const [rows] =
      await db.execute(
        `
        SELECT *
        FROM mobile_verifications
        WHERE citizen_id = ?
        AND otp = ?
        AND verified = FALSE
        AND expires_at > NOW()
        ORDER BY id DESC
        LIMIT 1
        `,
        [citizenId, otp]
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
