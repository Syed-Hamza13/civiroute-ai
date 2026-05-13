import db from "../config/db.js";

class Complaint {
  static async create(data) {
    const query = `
      INSERT INTO complaints (
        citizen_id,
        title,
        description,
        language,
        predicted_department_type_id,
        priority,
        status,
        confidence_score
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.citizen_id,
      data.title,
      data.description,
      data.language,
      data.predicted_department_type_id,
      data.priority,
      data.status,
      data.confidence_score,
    ];

    const [result] = await db.execute(query, values);

    return result;
  }

  static async findByCitizen(citizenId) {
    const query = `
      SELECT
        c.id,
        c.title,
        c.description,
        c.priority,
        c.status,
        c.submitted_at,

        dt.name AS department_name

      FROM complaints c

      LEFT JOIN department_types dt
      ON dt.id = c.predicted_department_type_id

      WHERE citizen_id = ?

      ORDER BY c.id DESC
    `;

    const [rows] = await db.execute(query, [citizenId]);

    return rows;
  }

  static async findByDepartment(departmentTypeId, cityId) {
    const query = `
  
    SELECT
      complaints.id,
      complaints.title,
      complaints.description,
      complaints.priority,
      complaints.status,
      complaints.submitted_at,

      citizens.full_name,

      department_types.name
      AS department_name

    FROM complaints

    INNER JOIN citizens
      ON citizens.id = complaints.citizen_id

    LEFT JOIN department_types
      ON department_types.id =
      complaints.predicted_department_type_id

    WHERE
      complaints.predicted_department_type_id = ?
      AND citizens.city_id = ?

    ORDER BY

      CASE complaints.priority

        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4

      END,

      complaints.id DESC

  `;

    const [rows] = await db.execute(query, [departmentTypeId, cityId]);

    return rows;
  }
}

export default Complaint;
