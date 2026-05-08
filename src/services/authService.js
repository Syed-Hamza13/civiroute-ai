import bcrypt from "bcrypt";
import Citizen from "../models/Citizen.js";
import SuperAdmin from "../models/SuperAdmin.js";
import Department from "../models/Department.js";

import transporter from "../config/mail.js";
import EmailVerification from "../models/EmailVerification.js";

class AuthService {
  static async loginAdmin(identifier, password) {
    const admin = await SuperAdmin.findByIdentifier(identifier);

    if (!admin) {
      throw new Error("Admin account not found");
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      throw new Error("Invalid password");
    }

    return admin;
  }

  static async registerCitizen(data) {
    const existingEmail = await Citizen.findByEmail(data.email);

    if (existingEmail) {
      throw new Error("Email already registered");
    }

    const existingMobile = await Citizen.findByMobile(data.mobile);

    if (existingMobile) {
      throw new Error("Mobile already registered");
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const result = await Citizen.create({
      ...data,
      password_hash,
    });

    const citizenId = result.insertId;

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP
    await EmailVerification.create(citizenId, otp);

    // send mail
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: data.email,
      subject: "Email Verification OTP",
      html: `
      <h2>Email Verification</h2>
      <p>Your OTP:</p>
      <h1>${otp}</h1>
      <p>Valid for 10 minutes.</p>
    `,
    });

    return {
      citizenId,
    };
  }

  static async loginCitizen(identifier, password) {
    const citizen = await Citizen.findByIdentifier(identifier);

    if (!citizen) {
      throw new Error("Citizen account not found");
    }

    if (!citizen.is_verified) {
      throw new Error("Please verify your email first");
    }

    if (citizen.status !== "active") {
      throw new Error("Account is blocked");
    }

    const isMatch = await bcrypt.compare(password, citizen.password_hash);

    if (!isMatch) {
      throw new Error("Invalid password");
    }

    return citizen;
  }

  static async createDepartment(data) {
    const existingDepartment = await Department.findByIdentifier(data.username);

    if (existingDepartment) {
      throw new Error("Department username already exists");
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const result = await Department.create({
      ...data,
      password_hash,
    });

    return result;
  }

  static async loginDepartment(identifier, password) {
    const department = await Department.findByIdentifier(identifier);

    if (!department) {
      throw new Error("Department account not found");
    }

    if (department.status !== "active") {
      throw new Error("Department account inactive");
    }

    const isMatch = await bcrypt.compare(password, department.password_hash);

    if (!isMatch) {
      throw new Error("Invalid password");
    }

    return department;
  }

  static async verifyCitizenEmail(citizenId, otp) {
    const verification = await EmailVerification.verify(citizenId, otp);

    if (!verification) {
      throw new Error("Invalid or expired OTP");
    }

    await Citizen.verifyEmail(citizenId);

    await EmailVerification.markVerified(verification.id);

    return true;
  }
}

export default AuthService;
