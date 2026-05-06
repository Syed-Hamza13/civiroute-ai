
import db from "../config/db.js";

class SuperAdmin {

  static async findByIdentifier(identifier) {

    const query = `
      SELECT *
      FROM super_admins
      WHERE email = ? OR username = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(query, [
      identifier,
      identifier
    ]);

    return rows[0];
  }

}

export default SuperAdmin;
