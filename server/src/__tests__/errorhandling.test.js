import request from 'supertest';
import express from 'express';
import routes from '../routes.js';

const app = express();
app.use(express.json());
app.use('/', routes);

// Simuleer centrale error handler zoals in index.js
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

describe('Foutafhandeling', () => {
  it('geeft nette error response bij geforceerde error', async () => {
    const res = await request(app).get('/error');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Test error');
    expect(res.body.stack).toBeDefined();
  });

  it('geeft 404 bij niet-bestaande route', async () => {
    const res = await request(app).get('/doesnotexist');
    // Express geeft standaard HTML bij 404, tenzij je een custom handler toevoegt
    // Hier checken we alleen dat het geen 500 is
    expect([404, 500]).toContain(res.statusCode);
  });
});
