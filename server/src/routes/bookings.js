const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Customer create booking
router.post('/', authenticateToken, bookingController.createBooking);

// Customer view own bookings
router.get('/my', authenticateToken, bookingController.getMyBookings);

// Staff / Admin view all bookings
router.get('/', authenticateToken, requireRole(['staff', 'admin']), bookingController.getAllBookings);

// View single booking (Customer can view own, Staff/Admin can view any)
router.get('/:id', authenticateToken, bookingController.getBookingById);

// Staff / Admin update booking status and coordination notes
router.patch('/:id/status', authenticateToken, requireRole(['staff', 'admin']), bookingController.updateBookingStatus);

module.exports = router;
