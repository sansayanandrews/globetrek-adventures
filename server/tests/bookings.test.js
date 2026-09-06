const request = require('supertest');
const app = require('../src/app');

describe('Bookings & Simulated Payment Tests', () => {
  let customerToken;
  let staffToken;
  let testPackage;
  let testAccommodation;
  let testTransport;
  let createdBookingId;

  beforeAll(async () => {
    // 1. Auth Tokens
    const cRes = await request(app).post('/api/auth/login').send({ email: 'customer@globetrek.com', password: 'Customer123!' });
    customerToken = cRes.body.data.token;

    const sRes = await request(app).post('/api/auth/login').send({ email: 'staff@globetrek.com', password: 'Staff123!' });
    staffToken = sRes.body.data.token;

    // 2. Fetch package, accommodation, transport
    const pkgRes = await request(app).get('/api/packages');
    testPackage = pkgRes.body.data[0];

    const accRes = await request(app).get('/api/catalog/accommodations');
    testAccommodation = accRes.body.data[0];

    const transRes = await request(app).get('/api/catalog/transportation');
    testTransport = transRes.body.data[0];
  });

  test('POST /api/bookings - Rejects missing required parameters with 400', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        package_id: testPackage.id
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/bookings - Successfully creates booking with simulated payment and live price calculation', async () => {
    const travellers = 2;
    const extraNights = 1;
    const expectedBase = testPackage.base_price_lkr * travellers;
    const expectedAcc = testAccommodation.price_per_night_lkr * extraNights;
    const expectedTrans = testTransport.price_lkr;
    const expectedTotal = expectedBase + expectedAcc + expectedTrans;

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        package_id: testPackage.id,
        travel_date: '2026-12-10',
        num_travellers: travellers,
        selected_accommodation_id: testAccommodation.id,
        selected_transport_id: testTransport.id,
        customizations: {
          extra_nights: extraNights,
          special_requests: 'Honeymoon arrangement'
        },
        payment_details: {
          cardholder_name: 'Amara Perera',
          card_number: '2198',
          expiry: '12/28',
          method: 'simulated'
        }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.booking.status).toBe('pending');
    expect(res.body.data.booking.payment_status).toBe('paid');
    expect(res.body.data.booking.total_price_lkr).toBe(expectedTotal);
    expect(res.body.data.payment.transaction_ref).toMatch(/^GT-TXN-/);

    createdBookingId = res.body.data.booking.id;
  });

  test('GET /api/bookings/my - Customer can fetch own bookings list', async () => {
    const res = await request(app)
      .get('/api/bookings/my')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((b) => b.id === createdBookingId)).toBe(true);
  });

  test('PATCH /api/bookings/:id/status - Staff can update status to confirmed and attach coordination notes', async () => {
    const notes = 'Booking confirmed. Chauffeur assigned: Mr. Ranjith (+94 77 444 3322).';
    const res = await request(app)
      .patch(`/api/bookings/${createdBookingId}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        status: 'confirmed',
        coordination_notes: notes
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('confirmed');
    expect(res.body.data.coordination_notes).toBe(notes);
  });
});
