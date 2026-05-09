import AuthService from "../services/authService.js";

class AdminController {
  static async createDepartment(req, res)  {
    try {
      const {
        department_type_id,
        city_id,
        office_name,
        email,
        mobile,
        username,
        password,
        address,
        pincode,
      } = req.body;

      await AuthService.createDepartment({
        department_type_id,
        city_id,
        office_name,
        email,
        mobile,
        username,
        password,
        address,
        pincode,
        created_by: req.session?.user?.id
      });

      res.send("Department created successfully");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}

export default AdminController;
