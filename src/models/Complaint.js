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
      data.confidence_score
    ];

    const [result] =
      await db.execute(query, values);

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

    const [rows] =
      await db.execute(query, [citizenId]);

    return rows;
  }

}

export default Complaint;