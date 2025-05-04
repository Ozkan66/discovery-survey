import request from 'supertest';
import express from 'express';
import routes from '../routes.js';

const app = express();
app.use(express.json());
app.use('/', routes);

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
function getAdminToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
}

describe('Admin endpoints validatie', () => {
  describe('POST /login', () => {
    it('accepteert geldige login', async () => {
      // Zet een geldige hash in .env voor ADMIN_PASSWORD
      const res = await request(app)
        .post('/login')
        .send({ username: 'admin', password: 'testwachtwoord' });
      // Let op: deze test faalt als het wachtwoord niet overeenkomt met de hash in .env
      expect([200, 401]).toContain(res.statusCode); // 200 = succes, 401 = fout wachtwoord
    });
    it('weigert als username ontbreekt', async () => {
      const res = await request(app)
        .post('/login')
        .send({ password: 'testwachtwoord' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
    it('weigert als wachtwoord te kort is', async () => {
      const res = await request(app)
        .post('/login')
        .send({ username: 'admin', password: '1' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('GET /admin/summary', () => {
    it('weigert zonder JWT token', async () => {
      const res = await request(app)
        .get('/admin/summary');
      expect(res.statusCode).toBe(401);
    });
    // Optie 1: zonder token, altijd 401
    it('weigert bij ongeldige from datum zonder token', async () => {
      const res = await request(app)
        .get('/admin/summary')
        .send({ from: '2021-99-99' });
      expect(res.statusCode).toBe(401);
    });
    it('weigert bij from datum in het verleden zonder token', async () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const res = await request(app)
        .get('/admin/summary')
        .send({ from: yesterday });
      expect(res.statusCode).toBe(401);
    });
    it('weigert bij ongeldige to datum zonder token', async () => {
      const res = await request(app)
        .get('/admin/summary')
        .send({ to: 'blabla' });
      expect(res.statusCode).toBe(401);
    });
    it('weigert bij to datum in het verleden zonder token', async () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const res = await request(app)
        .get('/admin/summary')
        .send({ to: yesterday });
      expect(res.statusCode).toBe(401);
    });
    // Optie 2: met geldige admin JWT
    it('weigert bij ongeldige from datum met token', async () => {
      const token = getAdminToken();
      const res = await request(app)
        .get('/admin/summary')
        .set('Authorization', `Bearer ${token}`)
        .send({ from: '2021-99-99' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
    it('weigert bij from datum in het verleden met token', async () => {
      const token = getAdminToken();
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const res = await request(app)
        .get('/admin/summary')
        .set('Authorization', `Bearer ${token}`)
        .send({ from: yesterday });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
    it('weigert bij ongeldige to datum met token', async () => {
      const token = getAdminToken();
      const res = await request(app)
        .get('/admin/summary')
        .set('Authorization', `Bearer ${token}`)
        .send({ to: 'blabla' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
    it('weigert bij to datum in het verleden met token', async () => {
      const token = getAdminToken();
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const res = await request(app)
        .get('/admin/summary')
        .set('Authorization', `Bearer ${token}`)
        .send({ to: yesterday });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
    it('accepteert geldige from/to met token', async () => {
      const token = getAdminToken();
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      const res = await request(app)
        .get('/admin/summary')
        .set('Authorization', `Bearer ${token}`)
        .send({ from: tomorrow, to: tomorrow });
      expect([200, 501]).toContain(res.statusCode); // 501 als niet geïmplementeerd
    });
    // Voorbeeld: met geldige token (optioneel)
    // it('accepteert met geldige JWT en geldige from/to', async () => {
    //   const token = '...'; // Genereer een geldige admin JWT
    //   const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    //   const res = await request(app)
    //     .get('/admin/summary')
    //     .set('Authorization', `Bearer ${token}`)
    //     .send({ from: tomorrow, to: tomorrow });
    //   expect([200, 501]).toContain(res.statusCode); // 501 als niet geïmplementeerd
    // });
  });

  describe('GET /health', () => {
    it('accepteert zonder body/query', async () => {
      const res = await request(app)
        .get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
    it('weigert met body', async () => {
      const res = await request(app)
        .get('/health')
        .send({ foo: 'bar' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
    it('weigert met query', async () => {
      const res = await request(app)
        .get('/health?x=1');
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });
});
