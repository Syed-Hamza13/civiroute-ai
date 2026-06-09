const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAssignedComplaints, resolveComplaint } = require('../controllers/supervisor.controller');
const { protect } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/rbac.middleware');

// Multer Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'proof-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.use(protect);
router.use(checkRole(['Supervisor']));

router.get('/complaints', getAssignedComplaints);
router.post('/complaints/resolve', upload.single('proofImage'), resolveComplaint);

module.exports = router;