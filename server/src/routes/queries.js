const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');

// Submit query (Public contact form or Authenticated customer)
router.post('/', optionalAuth, queryController.createQuery);

// Customer view own queries
router.get('/my', authenticateToken, queryController.getMyQueries);

// Staff / Admin view all queries
router.get('/', authenticateToken, requireRole(['staff', 'admin']), queryController.getAllQueries);

// View single query
router.get('/:id', authenticateToken, queryController.getQueryById);

// Staff / Admin respond to query
router.patch('/:id/respond', authenticateToken, requireRole(['staff', 'admin']), queryController.respondQuery);

module.exports = router;
