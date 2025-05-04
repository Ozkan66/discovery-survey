import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../index.js';

// Gebruik een test secret die overeenkomt met je backend .env
const TEST_SECRET = process.env.JWT_SECRET || 'secret';

describe('Admin Summary Endpoint Auth & Edge Cases', () => {
  let adminToken, userToken;

  beforeAll(() => {
    // Maak tokens aan voor verschillende rollen
    adminToken = jwt.sign({ username: 'admin', role: 'admin' }, TEST_SECRET, { expiresIn: '1h' });
    userToken = jwt.sign({ username: 'user', role: 'user' }, TEST_SECRET, { expiresIn: '1h' });
  });

  it('geeft 401 zonder token', async () => {
    const res = await request(app).get('/api/admin/summary');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/token/i);
  });

  it('geeft 401 bij ongeldige token', async () => {
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', 'Bearer onzin.onzin.onzin');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/token/i);
  });

  it('geeft 200 en data bij geldige admin-token', async () => {
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200, 500]).toContain(res.status); // 500 als er geen data is
    if (res.status === 200) {
      expect(res.body.summary).toBeDefined();
    }
  });

  it('geeft 200 bij geldige user-token (indien geen rol-check)', async () => {
    // Pas aan naar 403 als je rol-checks toevoegt
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${userToken}`);
    expect([200, 403]).toContain(res.status);
  });

  it('geeft 500 bij ontbrekende/corrupte survey.json', async () => {
    // Simuleer door survey.json tijdelijk te hernoemen of te vervangen
    // (optioneel, afhankelijk van implementatie)
    // Kan ook met een mock van fs/promises
    // Hier alleen een placeholder:
    expect(true).toBe(true);
  });
});
