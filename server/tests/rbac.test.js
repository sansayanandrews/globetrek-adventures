const request = require('supertest');
const app = require('../src/app');

describe('Role-Based Access Control (RBAC) Tests', () => {
  let customerToken;
  let staffToken;
  let adminToken;

  beforeAll(async () => {
    // 1. Customer
    const cRes = await request(app).post('/api/auth/login').send({ email: 'customer@globetrek.com', password: 'Customer123!' });
    customerToken = cRes.body.data.token;

    // 2. Staff
    const sRes = await request(app).post('/api/auth/login').send({ email: 'staff@globetrek.com', password: 'Staff123!' });
    staffToken = sRes.body.data.token;

    // 3. Admin
    const aRes = await request(app).post('/api/auth/login').send({ email: 'admin@globetrek.com', password: 'Admin123!' });
    adminToken = aRes.body.data.token;
  });

  test('Customer JWT hitting /api/admin/staff is rejected with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/admin/staff')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  test('Customer JWT hitting /api/admin/analytics is rejected with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  test('Staff JWT hitting /api/admin/staff is rejected with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/admin/staff')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  test('Admin JWT hitting /api/admin/staff is accepted with 200 OK', async () => {
    const res = await request(app)
      .get('/api/admin/staff')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('Admin JWT hitting /api/admin/analytics is accepted with 200 OK', async () => {
    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.overview).toBeDefined();
    expect(res.body.data.revenueTrends).toBeDefined();
  });
});
