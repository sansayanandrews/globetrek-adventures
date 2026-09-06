const request = require('supertest');
const app = require('../src/app');

describe('Customer Queries & Staff Response Tests', () => {
  let customerToken;
  let staffToken;
  let createdQueryId;

  beforeAll(async () => {
    const cRes = await request(app).post('/api/auth/login').send({ email: 'customer@globetrek.com', password: 'Customer123!' });
    customerToken = cRes.body.data.token;

    const sRes = await request(app).post('/api/auth/login').send({ email: 'staff@globetrek.com', password: 'Staff123!' });
    staffToken = sRes.body.data.token;
  });

  test('POST /api/queries - Authenticated customer can submit inquiry ticket', async () => {
    const res = await request(app)
      .post('/api/queries')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        category: 'customization_request',
        subject: 'Vegetarian cooking masterclass in Galle Fort',
        message: 'Could our 3-day southern tour include a private seafood-free Sri Lankan curry masterclass?'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('open');
    createdQueryId = res.body.data.id;
  });

  test('GET /api/queries/my - Customer can view their inquiries', async () => {
    const res = await request(app)
      .get('/api/queries/my')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.some((q) => q.id === createdQueryId)).toBe(true);
  });

  test('PATCH /api/queries/:id/respond - Customer cannot respond to inquiries (403)', async () => {
    const res = await request(app)
      .patch(`/api/queries/${createdQueryId}/respond`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        staff_response: 'Customer trying to respond'
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  test('PATCH /api/queries/:id/respond - Staff can respond and resolve inquiry', async () => {
    const reply = 'Yes, absolutely! We have partnered with a heritage villa chef in Galle Fort who conducts authentic cooking sessions.';
    const res = await request(app)
      .patch(`/api/queries/${createdQueryId}/respond`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        staff_response: reply,
        status: 'resolved'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('resolved');
    expect(res.body.data.staff_response).toBe(reply);
    expect(res.body.data.assigned_staff_id).toBeDefined();
  });
});
