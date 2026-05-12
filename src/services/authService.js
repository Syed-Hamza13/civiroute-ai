import db from "../config/db.js";
import bcrypt from "bcrypt";
import Citizen from "../models/Citizen.js";
import SuperAdmin from "../models/SuperAdmin.js";
import Department from "../models/Department.js";

import transporter from "../config/mail.js";
import EmailVerification from "../models/EmailVerification.js";

import MobileVerification from "../models/MobileVerification.js";
import { sendWhatsAppOTP } from "./whatsappService.js";

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: data.email,
      subject: "Email Verification OTP",
      html: `
      <h2>Email Verification</h2>
      <h1>${otp}</h1>
      <p>Valid for 10 minutes</p>
    `,
    });

    return { otp };
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

  static async sendMobileOtp(phone) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await MobileVerification.create(phone, otp);

    await sendWhatsAppOTP(phone, otp);

    return true;
  }

  static async verifyCitizenMobile(phone, otp) {
    const verification = await MobileVerification.verify(phone, otp);

    if (!verification) {
      throw new Error("Invalid or expired OTP");
    }

    await MobileVerification.markVerified(verification.id);

    return true;
  }

  static async createVerifiedCitizen(data) {
    const password_hash = await bcrypt.hash(data.password, 10);

    await Citizen.create({
      ...data,
      password_hash,
      is_verified: true,
      mobile_verified: true,
    });

    return true;
  }

  static async getStates() {
    const [rows] = await db.execute(`
      SELECT id, name
      FROM states
      ORDER BY name ASC
    `);

    return rows;
  }

  static async getCities(stateId) {
    const [rows] = await db.execute(
      `
      SELECT id, name
      FROM cities
      WHERE state_id = ?
      ORDER BY name ASC
      `,
      [stateId],
    );

    return rows;
  }

  static async getAvailableStates() {
    const [rows] = await db.execute(`
      
      SELECT DISTINCT
        states.id,
        states.name

      FROM states

      INNER JOIN departments
        ON departments.state_id = states.id

      ORDER BY states.name ASC

    `);

    return rows;
  }
  static async getAvailableCities(stateId) {
    const [rows] = await db.execute(
      `
      SELECT DISTINCT
        cities.id,
        cities.name

      FROM cities

      INNER JOIN departments
        ON departments.city_id = cities.id

      WHERE cities.state_id = ?

      ORDER BY cities.name ASC
      `,
      [stateId],
    );

    return rows;
  }
}

export default AuthService;
