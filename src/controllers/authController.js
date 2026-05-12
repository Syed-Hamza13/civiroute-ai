import AuthService from "../services/authService.js";
import Citizen from "../models/Citizen.js";




class AuthController {
  // Helper function to generate JWT token
  
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

      // Validation
      if (!full_name || !email || !mobile || !address || !city_id || !pincode || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (password !== confirm_password) {
        return res.status(400).json({
          success: false,
          message: "Passwords do not match",
        });
      }

      const normalizedMobile = Citizen.normalizeMobile(mobile);

      const result = await AuthService.registerCitizen({
        full_name,
        email,
        mobile: normalizedMobile,
        address,
        city_id,
        pincode,
        password,
      });

      return res.status(201).json({
        success: true,
        message: "Account created successfully! You can now login.",
        user: {
          id: result.insertId,
          full_name,
          email,
          mobile: normalizedMobile,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Signup failed",
      });
    }
  }

  static async login(req, res) {
    try {
      const requestBody = req.body;
      console.log("Login request body:", requestBody);
      const { username, identifier, password, role } = req.body;

      // Support both username and identifier parameter names
      const loginIdentifier = username || identifier;

      let user = null;

      // =========================
      // Citizen Login
      // =========================
      if (role === "citizen") {
        const citizen = await AuthService.loginCitizen(loginIdentifier, password);

        user = {
          id: citizen.id,
          role: "citizen",
          name: citizen.full_name,
          email: citizen.email,
        };

        // redirectUrl = "/citizen/dashboard";
      }

      // =========================
      // Admin Login
      // =========================
      else if (role === "admin") {
        const admin = await AuthService.loginAdmin(loginIdentifier, password);

        user = {
          id: admin.id,
          role: "admin",
          name: admin.full_name,
          email: admin.email,
        };

        // redirectUrl = "/admin/dashboard";
      }

      // =========================
      // Department Login
      // =========================
      else if (role === "department") {
        const department = await AuthService.loginDepartment(
          loginIdentifier,
          password,
        );

        user = {
          id: department.id,
          role: "department",
          name: department.office_name,
          email: department.email,
        };

        // redirectUrl = "/department/dashboard";
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

        // Generate JWT token
        const token = AuthController.generateToken(user);

        req.session.save((err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Session save failed",
            });
          }

          return res.json({
            success: true,
            token,
            user,
          });
        });
      });
    } catch (error) {
      return res.status(401).send(error.message);
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { otp } = req.body;

      const pending = req.session.pendingSignup;

      if (!pending) {
        return res.status(400).send("Session expired");
      }

      if (pending.emailOtp !== otp) {
        return res.status(400).send("Invalid OTP");
      }

      pending.emailVerified = true;

      res.send("Email verified successfully");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async sendMobileOtp(req, res) {
    try {
      const pending = req.session.pendingSignup;

      if (!pending) {
        return res.status(400).send("Session expired");
      }

      await AuthService.sendMobileOtp(pending.mobile);

      res.send("OTP sent on WhatsApp");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async verifyMobile(req, res) {
    try {
      const { otp } = req.body;

      const pending = req.session.pendingSignup;

      if (!pending) {
        return res.status(400).send("Session expired");
      }

      const ok = await AuthService.verifyCitizenMobile(pending.mobile, otp);

      if (!ok) {
        return res.status(400).send("Invalid OTP");
      }

      await AuthService.createVerifiedCitizen(pending);

      delete req.session.pendingSignup;

      res.send("Account created successfully");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}

export default AuthController;
