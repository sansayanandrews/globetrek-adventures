const prisma = require('../config/prisma');
const { logAudit } = require('../utils/auditLogger');

// POST /api/queries (Customer or Public Contact)
async function createQuery(req, res, next) {
  try {
    const { category, subject, message, booking_id } = req.body;

    if (!category || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Category, subject, and message are required.'
        }
      });
    }

    const userId = req.user ? req.user.id : null;
    const bookingId = booking_id ? parseInt(booking_id, 10) : null;

    const query = await prisma.query.create({
      data: {
        user_id: userId,
        booking_id: bookingId,
        category,
        subject: subject.trim(),
        message: message.trim(),
        status: 'open'
      }
    });

    if (userId) {
      await prisma.notification.create({
        data: {
          user_id: userId,
          message: `Your inquiry "${subject}" has been received. A GlobeTrek travel specialist will review and respond shortly.`
        }
      });
      await logAudit(userId, 'QUERY_SUBMITTED', 'QUERY', query.id);
    }

    return res.status(201).json({
      success: true,
      data: query
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/queries/my (Customer)
async function getMyQueries(req, res, next) {
  try {
    const queries = await prisma.query.findMany({
      where: { user_id: req.user.id },
      include: {
        booking: {
          include: { package: true }
        },
        assigned_staff: {
          select: { id: true, full_name: true, email: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return res.json({ success: true, data: queries });
  } catch (err) {
    next(err);
  }
}

// GET /api/queries (Staff / Admin)
async function getAllQueries(req, res, next) {
  try {
    const { status, category } = req.query;

    const where = {};
    if (status && status !== 'All') {
      where.status = status;
    }
    if (category && category !== 'All') {
      where.category = category;
    }

    const queries = await prisma.query.findMany({
      where,
      include: {
        customer: {
          select: { id: true, full_name: true, email: true, phone: true }
        },
        booking: {
          include: { package: true }
        },
        assigned_staff: {
          select: { id: true, full_name: true, email: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return res.json({ success: true, data: queries });
  } catch (err) {
    next(err);
  }
}

// GET /api/queries/:id
async function getQueryById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const query = await prisma.query.findUnique({
      where: { id },
      include: {
        customer: {
          select: { id: true, full_name: true, email: true, phone: true }
        },
        booking: {
          include: { package: true }
        },
        assigned_staff: {
          select: { id: true, full_name: true, email: true }
        }
      }
    });

    if (!query) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Inquiry not found.' }
      });
    }

    if (req.user.role === 'customer' && query.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Unauthorized access to this inquiry.' }
      });
    }

    return res.json({ success: true, data: query });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/queries/:id/respond (Staff / Admin)
async function respondQuery(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const { staff_response, status } = req.body;

    if (!staff_response) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Response text is required.' }
      });
    }

    const existing = await prisma.query.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Inquiry not found.' }
      });
    }

    const updated = await prisma.query.update({
      where: { id },
      data: {
        assigned_staff_id: req.user.id,
        staff_response: staff_response.trim(),
        status: status || 'resolved',
        resolved_at: status === 'resolved' || !status ? new Date() : null
      },
      include: {
        customer: true,
        assigned_staff: true
      }
    });

    // Notify customer
    if (existing.user_id) {
      await prisma.notification.create({
        data: {
          user_id: existing.user_id,
          message: `GlobeTrek Staff (${req.user.full_name}) responded to your query "${existing.subject}".`
        }
      });
    }

    await logAudit(req.user.id, 'QUERY_RESOLVED', 'QUERY', id);

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createQuery,
  getMyQueries,
  getAllQueries,
  getQueryById,
  respondQuery
};
