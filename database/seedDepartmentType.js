
import db from "../src/config/db.js";

async function seedDepartmentTypes() {

  try {

    const departmentTypes = [
      {
        name: "Water Supply",
        description: "Water related complaints"
      },
      {
        name: "Electricity",
        description: "Electricity and power complaints"
      },
      {
        name: "Roads",
        description: "Road damage and maintenance complaints"
      },
      {
        name: "Sanitation",
        description: "Garbage and cleanliness complaints"
      },
      {
        name: "Public Services",
        description: "General public service complaints"
      }
    ];

    for (const dept of departmentTypes) {

      await db.execute(
        `
        INSERT INTO department_types (
          name,
          description
        )
        VALUES (?, ?)
        `,
        [
          dept.name,
          dept.description
        ]
      );

    }

    console.log("✅ Department types seeded successfully");

    process.exit(0);

  } catch (error) {

    console.error("❌ Failed to seed department types");
    console.error(error.message);

    process.exit(1);

  }

}

seedDepartmentTypes();
