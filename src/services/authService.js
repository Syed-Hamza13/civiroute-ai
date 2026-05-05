
import bcrypt from "bcrypt";
import Citizen from "../models/Citizen.js";

class AuthService {
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
}

export default AuthService;
