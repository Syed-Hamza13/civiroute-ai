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

      // =========================
      // Citizen Login
      // =========================
      if (role === "citizen") {
        const citizen = await AuthService.loginCitizen(identifier, password);

        req.session.user = {
          id: citizen.id,
          role: "citizen",
          name: citizen.full_name,
          email: citizen.email,
        };

        return res.redirect("/citizen/dashboard");
      }

      // =========================
      // Admin Login
      // =========================
      if (role === "admin") {
        const admin = await AuthService.loginAdmin(identifier, password);

        req.session.user = {
          id: admin.id,
          role: "admin",
          name: admin.full_name,
          email: admin.email,
        };

        return res.redirect("/admin/dashboard");
      }

      // =========================
      // Department Login
      // =========================

      if (role === "department") {
        const department = await AuthService.loginDepartment(
          identifier,
          password,
        );

        req.session.user = {
          id: department.id,
          role: "department",
          name: department.office_name,
          email: department.email,
        };

        return res.redirect("/department/dashboard");
      }

      return res.status(400).send("Invalid role");
    } catch (error) {
      return res.status(401).send(error.message);
    }
  }
}

export default AuthController;
