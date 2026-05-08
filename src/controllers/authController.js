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

      const result = await AuthService.registerCitizen({
        full_name,
        email,
        mobile,
        address,
        city_id,
        pincode,
        password,
      });

      req.session.pendingVerification = {
        citizenId: result.citizenId,
      };

      res.redirect("/verify-email");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async login(req, res) {
    try {
      const { identifier, password, role } = req.body;

      let user = null;
      let redirectUrl = "";

      // =========================
      // Citizen Login
      // =========================
      if (role === "citizen") {
        const citizen = await AuthService.loginCitizen(identifier, password);

        user = {
          id: citizen.id,
          role: "citizen",
          name: citizen.full_name,
          email: citizen.email,
        };

        redirectUrl = "/citizen/dashboard";
      }

      // =========================
      // Admin Login
      // =========================
      else if (role === "admin") {
        const admin = await AuthService.loginAdmin(identifier, password);

        user = {
          id: admin.id,
          role: "admin",
          name: admin.full_name,
          email: admin.email,
        };

        redirectUrl = "/admin/dashboard";
      }

      // =========================
      // Department Login
      // =========================
      else if (role === "department") {
        const department = await AuthService.loginDepartment(
          identifier,
          password,
        );

        user = {
          id: department.id,
          role: "department",
          name: department.office_name,
          email: department.email,
        };

        redirectUrl = "/department/dashboard";
      } else {
        return res.status(400).send("Invalid role");
      }

      // =========================
      // Session Rotation
      // =========================
      req.session.regenerate((err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Session creation failed");
        }

        req.session.user = user;

        req.session.save((err) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Session save failed");
          }

          return res.redirect(redirectUrl);
        });
      });
    } catch (error) {
      return res.status(401).send(error.message);
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { otp } = req.body;

      const pending = req.session.pendingVerification;

      if (!pending) {
        return res.status(400).send("No verification session found");
      }

      await AuthService.verifyCitizenEmail(pending.citizenId, otp);

      delete req.session.pendingVerification;

      res.send("Email verified successfully. You can now login.");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}

export default AuthController;
