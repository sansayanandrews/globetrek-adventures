const prisma = require('../config/prisma');
const { logAudit } = require('../utils/auditLogger');

function generateTransactionRef() {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let ref = 'GT-TXN-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// POST /api/bookings (Customer)
async function createBooking(req, res, next) {
  try {
    const {
      package_id,
      travel_date,
      num_travellers,
      selected_accommodation_id,
      selected_transport_id,
      customizations,
      payment_details
    } = req.body;

    if (!package_id || !travel_date || !num_travellers) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Package, travel date, and number of travellers are required.'
        }
      });
    }

    const pkg = await prisma.package.findUnique({
      where: { id: parseInt(package_id, 10) }
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        error: { code: 'PACKAGE_NOT_FOUND', message: 'Package does not exist.' }
      });
    }

    // Parse customizations
    const customObj = typeof customizations === 'string' ? JSON.parse(customizations || '{}') : (customizations || {});
    const extraNights = parseInt(customObj.extra_nights || 0, 10);
    const travellers = parseInt(num_travellers, 10);

    let accommodationCost = 0;
    let selectedAccId = selected_accommodation_id ? parseInt(selected_accommodation_id, 10) : null;
    if (selectedAccId) {
      const acc = await prisma.accommodation.findUnique({ where: { id: selectedAccId } });
      if (acc) {
        // Price for extra nights or luxury difference
        accommodationCost = acc.price_per_night_lkr * extraNights;
      }
    }

    let transportCost = 0;
    let selectedTransId = selected_transport_id ? parseInt(selected_transport_id, 10) : null;
    if (selectedTransId) {
      const trans = await prisma.transportation.findUnique({ where: { id: selectedTransId } });
      if (trans) {
        transportCost = trans.price_lkr;
      }
    }

    // Base package price multiplied by number of travelers
    const subtotal = (pkg.base_price_lkr * travellers) + accommodationCost + transportCost;
    const total = subtotal;

    // Validate simulated payment format
    if (!payment_details || !payment_details.card_number || !payment_details.cardholder_name) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PAYMENT_ERROR',
          message: 'Valid payment details (simulated card) are required to complete your booking.'
        }
      });
    }

    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        user_id: req.user.id,
        package_id: pkg.id,
        travel_date,
        num_travellers: travellers,
        selected_accommodation_id: selectedAccId,
        selected_transport_id: selectedTransId,
        customizations: JSON.stringify(customObj),
        subtotal_lkr: subtotal,
        total_price_lkr: total,
        status: 'pending',
        payment_status: 'paid',
        coordination_notes: 'Booking received. Agency staff will verify hotel and transport availability.'
      }
    });

    // Create Simulated Payment
    const txnRef = generateTransactionRef();
    const payment = await prisma.payment.create({
      data: {
        booking_id: booking.id,
        amount_lkr: total,
        method: 'simulated',
        status: 'success',
        transaction_ref: txnRef
      }
    });

    // Send in-app notification (Assumption 4: simulated email/SMS)
    await prisma.notification.create({
      data: {
        user_id: req.user.id,
        message: `Your booking for "${pkg.title}" on ${travel_date} has been placed! Transaction Ref: ${txnRef}. Our Negombo office is reviewing your coordination details.`
      }
    });

    // Log audit
    await logAudit(req.user.id, 'BOOKING_CREATED', 'BOOKING', booking.id);

    return res.status(201).json({
      success: true,
      data: {
        booking,
        payment
      }
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings/my (Customer)
async function getMyBookings(req, res, next) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { user_id: req.user.id },
      include: {
        package: true,
        accommodation: true,
        transportation: true,
        payments: true,
        handled_by: {
          select: { id: true, full_name: true, email: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings/:id
async function getBookingById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: {
          select: { id: true, full_name: true, email: true, phone: true }
        },
        package: true,
        accommodation: true,
        transportation: true,
        payments: true,
        handled_by: {
          select: { id: true, full_name: true, email: true }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Booking not found.' }
      });
    }

    // Role check: Customer can only view own booking
    if (req.user.role === 'customer' && booking.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to view this booking.' }
      });
    }

    return res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings (Staff / Admin)
async function getAllBookings(req, res, next) {
  try {
    const { status, search } = req.query;

    const where = {};
    if (status && status !== 'All') {
      where.status = status;
    }

    if (search) {
      const q = search.trim();
      where.OR = [
        { customer: { full_name: { contains: q } } },
        { customer: { email: { contains: q } } },
        { package: { title: { contains: q } } }
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        customer: {
          select: { id: true, full_name: true, email: true, phone: true }
        },
        package: true,
        accommodation: true,
        transportation: true,
        payments: true,
        handled_by: {
          select: { id: true, full_name: true, email: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/bookings/:id/status (Staff / Admin)
async function updateBookingStatus(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, coordination_notes } = req.body;

    const existing = await prisma.booking.findUnique({
      where: { id },
      include: { package: true, customer: true }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Booking not found.' }
      });
    }

    const updateData = {
      handled_by_staff_id: req.user.id
    };

    if (status) {
      updateData.status = status;
    }
    if (coordination_notes !== undefined) {
      updateData.coordination_notes = coordination_notes;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        package: true,
        accommodation: true,
        transportation: true,
        handled_by: true
      }
    });

    // Notify customer on status update
    if (status && status !== existing.status) {
      await prisma.notification.create({
        data: {
          user_id: existing.user_id,
          message: `Update on your booking for "${existing.package.title}": Status is now "${status.toUpperCase()}". Handled by staff ${req.user.full_name}.`
        }
      });
    }

    await logAudit(req.user.id, `BOOKING_STATUS_${status ? status.toUpperCase() : 'UPDATED'}`, 'BOOKING', id);

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus
};
