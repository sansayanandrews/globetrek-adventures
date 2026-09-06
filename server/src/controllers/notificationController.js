const prisma = require('../config/prisma');

async function getMyNotifications(req, res, next) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: 'desc' },
      take: 20
    });
    return res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

async function markNotificationRead(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await prisma.notification.updateMany({
      where: { id, user_id: req.user.id },
      data: { is_read: true }
    });
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyNotifications,
  markNotificationRead
};
