import request from 'supertest';
import express from 'express';
import routes from '../routes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Login endpoint', () => {
  it('should login successfully with correct admin credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'Kartal23' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'verkeerd' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should fail with missing fields', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should fail with non-existing user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'nietbestaat', password: 'iets123' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should fail with password as number', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 12345 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should fail with empty body', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should fail with malformed JSON', async () => {
    const res = await request(app)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send('nietjson');
    expect([400, 415]).toContain(res.statusCode);
  });
});
