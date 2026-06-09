const express = require('express');
const router = express.Router();
const { getDepartments, createDeptHead, deleteDepartment } = require('../controllers/superadmin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/rbac.middleware');

// Apply protection and RBAC strictly for SuperAdmin
router.use(protect);
router.use(checkRole(['SuperAdmin']));

router.route('/departments')
  .get(getDepartments)
  .post(createDeptHead);

router.route('/departments/:id')
  .delete(deleteDepartment);

module.exports = router;