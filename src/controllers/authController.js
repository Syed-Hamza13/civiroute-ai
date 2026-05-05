
import AuthService from "../services/authService.js";

class AuthController {
  static async signup(req, res) {
    try {
      const {
        full_name,
        email,
        mobile,
        address,
        city_id,
        pincode,
        password,
        confirm_password,
      } = req.body;

      if (password !== confirm_password) {
        return res.status(400).send("Passwords do not match");
      }

      await AuthService.registerCitizen({
        full_name,
        email,
        mobile,
        address,
        city_id,
        pincode,
        password,
      });

      res.send("Citizen registered successfully");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}

export default AuthController;
