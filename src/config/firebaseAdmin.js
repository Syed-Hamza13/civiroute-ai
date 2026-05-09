
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const serviceAccountPath =
  path.join(
    __dirname,
    "../../civiroute-firebase-adminsdk-fbsvc-769fba5fc5.json"
  );

const serviceAccount =
  JSON.parse(
    fs.readFileSync(
      serviceAccountPath,
      "utf8"
    )
  );

admin.initializeApp({
  credential:
    admin.credential.cert(
      serviceAccount
    ),
});

console.log(
  "✅ Firebase Admin Connected"
);

export default admin;
