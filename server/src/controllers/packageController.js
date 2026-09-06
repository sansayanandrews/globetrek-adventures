const prisma = require('../config/prisma');
const { logAudit } = require('../utils/auditLogger');

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// GET /api/packages
async function getPackages(req, res, next) {
  try {
    const { search, category, minPrice, maxPrice, duration, all } = req.query;

    const where = {};

    // By default, public users only see published packages
    const isStaffOrAdmin = req.user && ['staff', 'admin'].includes(req.user.role);
    if (!isStaffOrAdmin || all !== 'true') {
      where.is_published = true;
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.base_price_lkr = {};
      if (minPrice) where.base_price_lkr.gte = parseFloat(minPrice);
      if (maxPrice) where.base_price_lkr.lte = parseFloat(maxPrice);
    }

    if (duration) {
      where.duration_days = parseInt(duration, 10);
    }

    if (search) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { destination: { contains: q } },
        { description: { contains: q } }
      ];
    }

    const packages = await prisma.package.findMany({
      where,
      include: {
        accommodations: {
          include: { accommodation: true }
        },
        transports: {
          include: { transportation: true }
        },
        creator: {
          select: { id: true, full_name: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return res.json({
      success: true,
      data: packages
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/packages/:slugOrId
async function getPackageBySlugOrId(req, res, next) {
  try {
    const { slugOrId } = req.params;
    const isNum = /^\d+$/.test(slugOrId);

    const where = isNum
      ? { id: parseInt(slugOrId, 10) }
      : { slug: slugOrId };

    const pkg = await prisma.package.findUnique({
      where,
      include: {
        accommodations: {
          include: { accommodation: true }
        },
        transports: {
          include: { transportation: true }
        },
        creator: {
          select: { id: true, full_name: true }
        }
      }
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PACKAGE_NOT_FOUND',
          message: 'The requested tour package was not found.'
        }
      });
    }

    return res.json({
      success: true,
      data: pkg
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/packages (Staff/Admin)
async function createPackage(req, res, next) {
  try {
    const {
      title,
      destination,
      description,
      itinerary_summary,
      duration_days,
      base_price_lkr,
      category,
      cover_image_url,
      gallery,
      is_published,
      accommodation_ids,
      transportation_ids
    } = req.body;

    if (!title || !destination || !description || !base_price_lkr) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title, destination, description, and base price are required.'
        }
      });
    }

    let slug = generateSlug(title);
    // Ensure slug uniqueness
    const existing = await prisma.package.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newPackage = await prisma.package.create({
      data: {
        title: title.trim(),
        slug,
        destination: destination.trim(),
        description: description.trim(),
        itinerary_summary: itinerary_summary ? itinerary_summary.trim() : 'Full itinerary available upon booking confirmation.',
        duration_days: parseInt(duration_days || 3, 10),
        base_price_lkr: parseFloat(base_price_lkr),
        category: category || 'Cultural',
        cover_image_url: cover_image_url || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80',
        gallery: typeof gallery === 'string' ? gallery : JSON.stringify(gallery || []),
        is_published: is_published !== undefined ? Boolean(is_published) : true,
        created_by: req.user.id
      }
    });

    // Link accommodation options if provided
    if (Array.isArray(accommodation_ids) && accommodation_ids.length > 0) {
      for (let i = 0; i < accommodation_ids.length; i++) {
        await prisma.packageAccommodationOption.create({
          data: {
            package_id: newPackage.id,
            accommodation_id: parseInt(accommodation_ids[i], 10),
            is_default: i === 0
          }
        });
      }
    }

    // Link transport options if provided
    if (Array.isArray(transportation_ids) && transportation_ids.length > 0) {
      for (let i = 0; i < transportation_ids.length; i++) {
        await prisma.packageTransportOption.create({
          data: {
            package_id: newPackage.id,
            transportation_id: parseInt(transportation_ids[i], 10),
            is_default: i === 0
          }
        });
      }
    }

    await logAudit(req.user.id, 'PACKAGE_CREATED', 'PACKAGE', newPackage.id);

    return res.status(201).json({
      success: true,
      data: newPackage
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/packages/:id (Staff/Admin)
async function updatePackage(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      title,
      destination,
      description,
      itinerary_summary,
      duration_days,
      base_price_lkr,
      category,
      cover_image_url,
      gallery,
      is_published
    } = req.body;

    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'PACKAGE_NOT_FOUND', message: 'Package not found' }
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (destination !== undefined) updateData.destination = destination.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (itinerary_summary !== undefined) updateData.itinerary_summary = itinerary_summary.trim();
    if (duration_days !== undefined) updateData.duration_days = parseInt(duration_days, 10);
    if (base_price_lkr !== undefined) updateData.base_price_lkr = parseFloat(base_price_lkr);
    if (category !== undefined) updateData.category = category;
    if (cover_image_url !== undefined) updateData.cover_image_url = cover_image_url;
    if (gallery !== undefined) updateData.gallery = typeof gallery === 'string' ? gallery : JSON.stringify(gallery);
    if (is_published !== undefined) updateData.is_published = Boolean(is_published);

    const updated = await prisma.package.update({
      where: { id },
      data: updateData
    });

    await logAudit(req.user.id, 'PACKAGE_UPDATED', 'PACKAGE', updated.id);

    return res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/packages/:id (Staff/Admin)
async function deletePackage(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'PACKAGE_NOT_FOUND', message: 'Package not found' }
      });
    }

    await prisma.package.delete({ where: { id } });
    await logAudit(req.user.id, 'PACKAGE_DELETED', 'PACKAGE', id);

    return res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPackages,
  getPackageBySlugOrId,
  createPackage,
  updatePackage,
  deletePackage
};
