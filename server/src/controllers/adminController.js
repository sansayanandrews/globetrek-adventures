const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { logAudit } = require('../utils/auditLogger');

// GET /api/admin/staff
async function getStaffUsers(req, res, next) {
  try {
    const staffMembers = await prisma.user.findMany({
      where: {
        role: { in: ['staff', 'admin'] }
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        phone: true,
        is_active: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    });

    return res.json({ success: true, data: staffMembers });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/staff
async function createStaffUser(req, res, next) {
  try {
    const { full_name, email, password, role, phone } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Full name, email, and password are required.' }
      });
    }

    const assignedRole = role === 'admin' ? 'admin' : 'staff';

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'User with this email already exists.' }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStaff = await prisma.user.create({
      data: {
        full_name: full_name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: hashedPassword,
        role: assignedRole,
        phone: phone ? phone.trim() : null,
        is_active: true
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        phone: true,
        is_active: true,
        created_at: true
      }
    });

    await logAudit(req.user.id, 'STAFF_CREATED', 'USER', newStaff.id);

    return res.status(201).json({ success: true, data: newStaff });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/staff/:id/toggle-status
async function toggleStaffStatus(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: { code: 'CANNOT_DEACTIVATE_SELF', message: 'You cannot deactivate your own administrative account.' }
      });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found.' }
      });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { is_active: !user.is_active },
      select: { id: true, full_name: true, email: true, role: true, is_active: true }
    });

    await logAudit(req.user.id, updated.is_active ? 'STAFF_ACTIVATED' : 'STAFF_DEACTIVATED', 'USER', id);

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/audit-logs
async function getAuditLogs(req, res, next) {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        actor: {
          select: { id: true, full_name: true, email: true, role: true }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 100
    });

    return res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/analytics
async function getAnalytics(req, res, next) {
  try {
    const totalBookingsCount = await prisma.booking.count();
    const pendingBookingsCount = await prisma.booking.count({ where: { status: 'pending' } });
    const confirmedBookingsCount = await prisma.booking.count({ where: { status: 'confirmed' } });
    const totalCustomersCount = await prisma.user.count({ where: { role: 'customer' } });
    const totalPackagesCount = await prisma.package.count({ where: { is_published: true } });
    const openQueriesCount = await prisma.query.count({ where: { status: 'open' } });

    // Aggregate total revenue from paid bookings
    const revenueSum = await prisma.booking.aggregate({
      _sum: { total_price_lkr: true },
      where: { payment_status: 'paid' }
    });
    const totalRevenueLKR = revenueSum._sum.total_price_lkr || 0;

    // Bookings by destination
    const allBookings = await prisma.booking.findMany({
      include: { package: true }
    });

    const destinationCounts = {};
    allBookings.forEach(b => {
      const dest = b.package ? b.package.destination.split(',')[0].trim() : 'Other';
      destinationCounts[dest] = (destinationCounts[dest] || 0) + 1;
    });

    const bookingsByDestination = Object.keys(destinationCounts).map(dest => ({
      destination: dest,
      count: destinationCounts[dest]
    }));

    // Monthly revenue simulation data (for Recharts)
    const revenueTrends = [
      { month: 'Apr 2026', revenue: 420000, bookings: 3 },
      { month: 'May 2026', revenue: 680000, bookings: 5 },
      { month: 'Jun 2026', revenue: 540000, bookings: 4 },
      { month: 'Jul 2026', revenue: 890000, bookings: 7 },
      { month: 'Aug 2026', revenue: 1120000, bookings: 9 },
      { month: 'Sep 2026', revenue: totalRevenueLKR + 562000, bookings: totalBookingsCount + 4 }
    ];

    // Customer growth trends
    const customerGrowth = [
      { month: 'Apr 2026', customers: 12 },
      { month: 'May 2026', customers: 24 },
      { month: 'Jun 2026', customers: 38 },
      { month: 'Jul 2026', customers: 55 },
      { month: 'Aug 2026', customers: 72 },
      { month: 'Sep 2026', customers: 72 + totalCustomersCount }
    ];

    return res.json({
      success: true,
      data: {
        overview: {
          totalRevenueLKR,
          totalBookingsCount,
          pendingBookingsCount,
          confirmedBookingsCount,
          totalCustomersCount,
          totalPackagesCount,
          openQueriesCount
        },
        revenueTrends,
        bookingsByDestination,
        customerGrowth
      }
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/export-csv
async function exportBookingsCsv(req, res, next) {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        package: true,
        accommodation: true,
        transportation: true,
        payments: true
      },
      orderBy: { created_at: 'desc' }
    });

    // Generate CSV Header & Rows
    const headers = [
      'Booking ID',
      'Customer Name',
      'Customer Email',
      'Package Title',
      'Destination',
      'Travel Date',
      'Travellers',
      'Accommodation',
      'Transportation',
      'Total (LKR)',
      'Booking Status',
      'Payment Status',
      'Transaction Ref',
      'Created At'
    ];

    const rows = bookings.map(b => [
      b.id,
      `"${(b.customer?.full_name || '').replace(/"/g, '""')}"`,
      `"${(b.customer?.email || '').replace(/"/g, '""')}"`,
      `"${(b.package?.title || '').replace(/"/g, '""')}"`,
      `"${(b.package?.destination || '').replace(/"/g, '""')}"`,
      b.travel_date,
      b.num_travellers,
      `"${(b.accommodation?.name || 'N/A').replace(/"/g, '""')}"`,
      `"${(b.transportation?.type || 'N/A').replace(/"/g, '""')}"`,
      b.total_price_lkr,
      b.status,
      b.payment_status,
      b.payments[0]?.transaction_ref || 'N/A',
      b.created_at.toISOString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="globetrek_bookings_report.csv"');
    return res.send(csvContent);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStaffUsers,
  createStaffUser,
  toggleStaffStatus,
  getAuditLogs,
  getAnalytics,
  exportBookingsCsv
};
