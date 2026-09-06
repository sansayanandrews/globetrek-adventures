const prisma = require('../config/prisma');

async function getAccommodations(req, res, next) {
  try {
    const accommodations = await prisma.accommodation.findMany({
      orderBy: { rating: 'desc' }
    });
    return res.json({ success: true, data: accommodations });
  } catch (err) {
    next(err);
  }
}

async function getTransportation(req, res, next) {
  try {
    const transportation = await prisma.transportation.findMany({
      orderBy: { price_lkr: 'asc' }
    });
    return res.json({ success: true, data: transportation });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAccommodations,
  getTransportation
};
