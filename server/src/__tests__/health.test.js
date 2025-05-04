import request from 'supertest';
import express from 'express';
import routes from '../routes.js';

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Health endpoint', () => {
  it('GET /api/health should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('GET /api/health with query param should return 400', async () => {
    const res = await request(app).get('/api/health?foo=bar');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('GET /api/health with body should return 400', async () => {
    const res = await request(app)
      .get('/api/health')
      .send({ foo: 'bar' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});
