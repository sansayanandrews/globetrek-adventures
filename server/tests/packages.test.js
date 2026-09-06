const request = require('supertest');
const app = require('../src/app');

describe('Packages API & Permissions Tests', () => {
  let customerToken;
  let staffToken;
  let createdPackageId;

  beforeAll(async () => {
    // Login customer
    const cRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'customer@globetrek.com', password: 'Customer123!' });
    customerToken = cRes.body.data.token;

    // Login staff
    const sRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'staff@globetrek.com', password: 'Staff123!' });
    staffToken = sRes.body.data.token;
  });

  test('GET /api/packages - Public users can list tour packages', async () => {
    const res = await request(app).get('/api/packages');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/packages - Filter by destination or keyword works', async () => {
    const res = await request(app).get('/api/packages?search=Sigiriya');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.some((p) => p.destination.includes('Sigiriya'))).toBe(true);
  });

  test('POST /api/packages - Unauthenticated request is rejected with 401', async () => {
    const res = await request(app)
      .post('/api/packages')
      .send({
        title: 'Unauthorized Tour',
        destination: 'Colombo',
        description: 'Test description',
        base_price_lkr: 50000
      });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/packages - Customer role is rejected with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/packages')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        title: 'Customer Forbidden Tour',
        destination: 'Colombo',
        description: 'Test description',
        base_price_lkr: 50000
      });
    expect(res.statusCode).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  test('POST /api/packages - Staff role can successfully create a new tour package', async () => {
    const res = await request(app)
      .post('/api/packages')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        title: 'Trincomalee Coastal Fort & Coral Reef Tour',
        destination: 'Trincomalee & Pigeon Island',
        description: 'Explore the eastern shores of Sri Lanka, visit ancient Koneswaram temple on Swami Rock, and snorkel among reef sharks at Pigeon Island.',
        itinerary_summary: 'Day 1: Scenic drive east & temple sunset | Day 2: Pigeon Island marine sanctuary snorkeling | Day 3: Fort Frederick & return',
        duration_days: 3,
        base_price_lkr: 110000,
        category: 'Beach',
        cover_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        is_published: true
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toContain('trincomalee');
    createdPackageId = res.body.data.id;
  });

  test('PUT /api/packages/:id - Staff can update package details', async () => {
    const res = await request(app)
      .put(`/api/packages/${createdPackageId}`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        base_price_lkr: 115000
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.base_price_lkr).toBe(115000);
  });
});
