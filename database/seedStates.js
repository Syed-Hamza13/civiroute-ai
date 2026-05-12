import db from "../src/config/db.js";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi"
];

async function seedStates() {

  try {

    for (const state of states) {

      await db.execute(
        `
        INSERT IGNORE INTO states (name)
        VALUES (?)
        `,
        [state]
      );

    }

    console.log("✅ States seeded");

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

}

seedStates();