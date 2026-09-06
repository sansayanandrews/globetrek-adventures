const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'globetrek_super_secret_jwt_key_2026_lk';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { full_name, email, password, phone } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Full name, email, and password are required.'
        }
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please provide a valid email address.'
        }
      });
    }

    // Password strength check (min 6 characters, at least 1 number)
    if (password.length < 6 || !/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 6 characters long and include at least one number.'
        }
      });
    }

    // Check unique email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'An account with this email address already exists.'
        }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        full_name: full_name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: hashedPassword,
        role: 'customer',
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

    // Create welcome notification
    await prisma.notification.create({
      data: {
        user_id: newUser.id,
        message: `Welcome to GlobeTrek Adventures, ${newUser.full_name}! Explore our Sri Lankan tour packages or customize your dream holiday.`
      }
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token
      }
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required.'
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.'
        }
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_DEACTIVATED',
          message: 'Your account has been deactivated. Please contact support.'
        }
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.'
        }
      });
    }

    const token = generateToken(user);

    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      is_active: user.is_active,
      created_at: user.created_at
    };

    return res.json({
      success: true,
      data: {
        user: safeUser,
        token
      }
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function getCurrentUser(req, res) {
  return res.json({
    success: true,
    data: {
      user: req.user
    }
  });
}

// POST /api/auth/forgot-password (simulated stub)
async function forgotPassword(req, res) {
  const { email } = req.body;
  return res.json({
    success: true,
    message: `If an account exists for ${email || 'this address'}, a simulated password reset link has been dispatched.`
  });
}

module.exports = {
  register,
  login,
  getCurrentUser,
  forgotPassword
};
