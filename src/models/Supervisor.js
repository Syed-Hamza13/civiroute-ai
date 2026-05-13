import db from "../config/db.js";

class Supervisor {

  static async create(data) {

    const query = `

      INSERT INTO supervisors (

        department_id,
        full_name,
        email,
        mobile,
        username,
        password_hash

      )

      VALUES (?, ?, ?, ?, ?, ?)

    `;

    const values = [

      data.department_id,
      data.full_name,
      data.email,
      data.mobile,
      data.username,
      data.password_hash

    ];

    const [result] =
      await db.execute(
        query,
        values
      );

    return result;
  }

  static async findByIdentifier(
    identifier
  ) {

    const query = `

      SELECT *
      FROM supervisors

      WHERE
        username = ?
        OR email = ?

      LIMIT 1

    `;

    const [rows] =
      await db.execute(
        query,
        [
          identifier,
          identifier
        ]
      );

    return rows[0];
  }

  static async findByDepartment(
    departmentId
  ) {

    const query = `

      SELECT *
      FROM supervisors

      WHERE
        department_id = ?

      ORDER BY id DESC

    `;

    const [rows] =
      await db.execute(
        query,
        [departmentId]
      );

    return rows;
  }
}

export default Supervisor;