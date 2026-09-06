const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All admin routes require role 'admin'
router.use(authenticateToken, requireRole(['admin']));

router.get('/staff', adminController.getStaffUsers);
router.post('/staff', adminController.createStaffUser);
router.patch('/staff/:id/toggle-status', adminController.toggleStaffStatus);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/analytics', adminController.getAnalytics);
router.get('/export-csv', adminController.exportBookingsCsv);

module.exports = router;
