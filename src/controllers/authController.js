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

  static async login(req, res) {
    try {
      const { identifier, password, role } = req.body;

      if (role !== "citizen") {
        return res.send("Department/Admin login will be added next");
      }

      const citizen = await AuthService.loginCitizen(identifier, password);

      req.session.user = {
        id: citizen.id,
        role: "citizen",
        name: citizen.full_name,
        email: citizen.email,
      };

      res.redirect("/citizen/dashboard");
    } catch (error) {
      res.status(401).send(error.message);
    }
  }
}

export default AuthController;
