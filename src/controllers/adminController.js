import AuthService from "../services/authService.js";

class AdminController {
  static async createDepartment(req, res) {
    try {
      const {
        department_type_id,
        state_id,
        city_id,
        office_name,
        email,
        mobile,
        username,
        password,
        address,
        pincode,
        supervisors,
      } = req.body;

      await AuthService.createDepartment({
        department_type_id,
        state_id,
        city_id,
        office_name,
        email,
        mobile,
        username,
        password,
        address,
        pincode,
        supervisors,
        created_by: req.session?.user?.id,
      });

      res.send("Department created successfully");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async getStates(req, res) {
    try {
      const states = await AuthService.getStates();

      res.json(states);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getCities(req, res) {
    try {
      const { stateId } = req.params;

      const cities = await AuthService.getCities(stateId);

      res.json(cities);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

export default AdminController;
