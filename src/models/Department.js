import db from "../config/db.js";

class Department {
  // Create Department
  static async create(data) {
    const query = `
      INSERT INTO departments (
        department_type_id,
        state_id,
        city_id,
        office_name,
        email,
        mobile,
        username,
        password_hash,
        address,
        pincode,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.department_type_id,
      data.state_id,
      data.city_id,
      data.office_name,
      data.email,
      data.mobile,
      data.username,
      data.password_hash,
      data.address,
      data.pincode,
      data.created_by,
    ];

    const [result] = await db.execute(query, values);

    return result;
  }

  // Find by username/email
  static async findByIdentifier(identifier) {
    const query = `
      SELECT *
      FROM departments
      WHERE username = ?
      OR email = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(query, [identifier, identifier]);

    return rows[0];
  }
  static async findById(id) {
    const query = `
  
    SELECT *
    FROM departments
    WHERE id = ?
    LIMIT 1
  
  `;

    const [rows] = await db.execute(query, [id]);

    return rows[0];
  }
}

export default Department;
