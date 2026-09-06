const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');

// Public routes (with optional auth so staff sees unpublished if requested)
router.get('/', optionalAuth, packageController.getPackages);
router.get('/:slugOrId', packageController.getPackageBySlugOrId);

// Staff/Admin routes
router.post('/', authenticateToken, requireRole(['staff', 'admin']), packageController.createPackage);
router.put('/:id', authenticateToken, requireRole(['staff', 'admin']), packageController.updatePackage);
router.delete('/:id', authenticateToken, requireRole(['staff', 'admin']), packageController.deletePackage);

module.exports = router;
