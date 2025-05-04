import request from 'supertest';
import express from 'express';
import routes from '../routes.js';

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Integration tests: survey & login', () => {
  it('GET /survey geeft 200 en geldige structuur', async () => {
    const res = await request(app).get('/api/survey');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.themes) || Array.isArray(res.body)).toBe(true);
  });

  it('POST /login met verkeerde credentials geeft 401', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'foutwachtwoord' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('POST /login met ontbrekende velden geeft 400', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
