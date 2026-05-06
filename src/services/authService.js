import bcrypt from "bcrypt";
import Citizen from "../models/Citizen.js";
import SuperAdmin from "../models/SuperAdmin.js";
import Department from "../models/Department.js";

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

    return result;
  }

  static async loginCitizen(identifier, password) {
    const citizen = await Citizen.findByIdentifier(identifier);

    if (!citizen) {
      throw new Error("Citizen account not found");
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
}

export default AuthService;
