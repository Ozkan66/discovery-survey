import request from 'supertest';
import express from 'express';
import routes from '../routes.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', routes);

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
function getAdminToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
}

describe('Admin summary endpoint', () => {
  beforeEach(async () => {
    // Leeg de responses-tabel voor elke test
    const { openDb } = await import('../db.js');
    const db = await openDb();
    await db.run('DELETE FROM responses');
    await db.run('DELETE FROM participants');
    await db.close();
  });

  it('geeft 401 zonder token', async () => {
    const res = await request(app)
      .get('/api/admin/summary');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('geeft 401 bij ongeldige token', async () => {
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', 'Bearer nietechtetoken');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('geeft 400 bij ongeldige from/to (geen ISO)', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${token}`)
      .send({ from: 'niet-een-datum', to: '2024-01-01' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('geeft 400 bij from in het verleden', async () => {
    const token = getAdminToken();
    const verleden = new Date(Date.now() - 86400000).toISOString().slice(0,10);
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${token}`)
      .send({ from: verleden });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('geeft 200 bij geldige request zonder datums', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('summary');
  });

  it('geeft 200 bij geldige ISO datums', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${token}`)
      .send({ from: '2099-01-01', to: '2099-12-31' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('summary');
  });

  it('should return 400 for invalid date input', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${token}`)
      .send({ from: 'not-a-date', to: '2024-01-01' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return 200 for valid input (no dates)', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('summary');
  });

  it('should return 200 for valid ISO dates', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .get('/api/admin/summary?from=2024-01-01&to=2024-12-31')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('summary');
  });

  it('geeft lege summary bij geen responses', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.summary).toBeDefined();
    expect(Object.keys(res.body.summary)).toHaveLength(0);
  });

  it('geeft correcte summary bij 1 response', async () => {
    const token = getAdminToken();
    // Post een response met 2 antwoorden in hetzelfde subthema
    const resp = await request(app)
      .post('/api/responses')
      .send({
        participantContext: {
  functie: 'Leerkracht',
  leeftijd: '35',
  onderwijstype: 'Secundair',
  schoolgrootte: 'Tussen 300 en 800 leerlingen',
  net: 'GO!',
  ervaring: 'Medior'
},
        answers: {
          st1: { statementId: 'evaluatieprocessen_en_opvolging_onvoldoende_structuur_in_functionerings_en_evaluatiegesprekken_1', value: 8 },
          st2: { statementId: 'evaluatieprocessen_en_opvolging_onvoldoende_structuur_in_functionerings_en_evaluatiegesprekken_2', value: 6 }
        }
      });
    expect(resp.statusCode).toBe(200);
    // Haal summary op
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    const summary = res.body.summary;
    // Theme en subtheme ids uit survey.json
    expect(summary).toHaveProperty('performance_management');
    expect(summary.performance_management).toHaveProperty('evaluatieprocessen_en_opvolging');
    expect(summary.performance_management.evaluatieprocessen_en_opvolging.avg).toBeCloseTo(7.0);
    expect(summary.performance_management.evaluatieprocessen_en_opvolging.count).toBe(2);
  });

  it('geeft correcte summary bij meerdere responses', async () => {
    const token = getAdminToken();
    // Post twee responses, verschillende subthemes
    await request(app)
      .post('/api/responses')
      .send({
        participantContext: {
  functie: 'Directeur/Schoolleider',
  leeftijd: '25',
  onderwijstype: 'Secundair',
  schoolgrootte: 'Kleiner dan 300 leerlingen',
  net: 'Katholiek Onderwijs',
  ervaring: 'Starter: <2 jaar'
},
        answers: {
          st1: { statementId: 'evaluatieprocessen_en_opvolging_onvoldoende_structuur_in_functionerings_en_evaluatiegesprekken_1', value: 10 },
          st2: { statementId: 'evaluatieprocessen_en_opvolging_geen_centrale_plek_voor_evaluatiedocumentatie_1', value: 4 }
        }
      });
    await request(app)
      .post('/api/responses')
      .send({
        participantContext: {
  functie: 'HR-medewerker (school)',
  leeftijd: '40',
  onderwijstype: 'Secundair',
  schoolgrootte: 'Meer dan 800 leerlingen',
  net: 'Stedelijk-Provinciaal Onderwijs',
  ervaring: 'Senior: >10 jaar'
},
        answers: {
          st3: { statementId: 'evaluatieprocessen_en_opvolging_onvoldoende_structuur_in_functionerings_en_evaluatiegesprekken_2', value: 6 },
          st4: { statementId: 'evaluatieprocessen_en_opvolging_geen_centrale_plek_voor_evaluatiedocumentatie_2', value: 8 }
        }
      });

    // Haal summary op
    const res = await request(app)
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    const summary = res.body.summary;
    // Log de daadwerkelijke keys van de summary voor debug
    console.log('Subthema keys:', Object.keys(summary.performance_management));
    // Check averages
    expect(summary.performance_management.evaluatieprocessen_en_opvolging.avg).toBeCloseTo(7.0); // (10+6+8+4)/4
    expect(summary.performance_management.evaluatieprocessen_en_opvolging.count).toBe(4);
  });
});
