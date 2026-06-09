const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getMyComplaints, lodgeComplaint } = require('../controllers/citizen.controller');
const { protect } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/rbac.middleware');

// Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensures files go to backend/uploads
  },
  filename: function (req, file, cb) {
    cb(null, 'citizen-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.use(protect);
router.use(checkRole(['Citizen']));

router.route('/complaints')
  .get(getMyComplaints)
  .post(upload.single('document'), lodgeComplaint);

module.exports = router;