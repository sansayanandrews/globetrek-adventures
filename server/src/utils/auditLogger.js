const prisma = require('../config/prisma');

async function logAudit(actorUserId, action, targetType, targetId = null) {
  try {
    const log = await prisma.auditLog.create({
      data: {
        actor_user_id: actorUserId,
        action,
        target_type: targetType,
        target_id: targetId ? Number(targetId) : null
      }
    });
    return log;
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
    return null;
  }
}

module.exports = { logAudit };
