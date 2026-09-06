const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/prisma');

describe('Auth API Tests', () => {
  const testEmail = `traveler_${Date.now()}@example.com`;

  test('POST /api/auth/register - Successfully registers new customer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        full_name: 'Test Traveler',
        email: testEmail,
        password: 'Password123!',
        phone: '+94 77 111 2233'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testEmail.toLowerCase());
    expect(res.body.data.user.role).toBe('customer');
    expect(res.body.data.token).toBeDefined();
  });

  test('POST /api/auth/register - Rejects duplicate email with 409', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        full_name: 'Duplicate User',
        email: testEmail,
        password: 'Password123!'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('EMAIL_EXISTS');
  });

  test('POST /api/auth/register - Rejects weak password with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        full_name: 'Weak Password User',
        email: `weak_${Date.now()}@example.com`,
        password: 'abc'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('POST /api/auth/login - Successfully logs in seeded customer', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@globetrek.com',
        password: 'Customer123!'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('customer');
    expect(res.body.data.token).toBeDefined();
  });

  test('POST /api/auth/login - Rejects invalid password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@globetrek.com',
        password: 'WrongPassword999!'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  test('GET /api/auth/me - Returns current user from Bearer JWT', async () => {
    // 1. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@globetrek.com',
        password: 'Customer123!'
      });

    const token = loginRes.body.data.token;

    // 2. Request /me
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.statusCode).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.data.user.email).toBe('customer@globetrek.com');
  });
});
