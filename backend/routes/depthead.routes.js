const express = require('express');
const router = express.Router();
const { 
  getSupervisors, createSupervisor, getComplaints, assignComplaint, approveResolution 
} = require('../controllers/depthead.controller');
const { protect } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/rbac.middleware');

// Apply protection and RBAC strictly for DeptHead
router.use(protect);
router.use(checkRole(['DeptHead']));

router.route('/supervisors')
  .get(getSupervisors)
  .post(createSupervisor);

router.route('/complaints')
  .get(getComplaints);

router.patch('/complaints/assign', assignComplaint);
router.patch('/complaints/approve', approveResolution);

module.exports = router;