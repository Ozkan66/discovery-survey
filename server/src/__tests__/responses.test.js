import request from 'supertest';
import express from 'express';
import routes from '../routes.js';

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('POST /api/responses input validatie', () => {
  it('accepteert een geldige response', async () => {
    const res = await request(app)
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
          stelling1: { statementId: 'stelling1', value: 8 },
          stelling2: { statementId: 'stelling2', value: 2, comment: 'voorbeeld' }
        }
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('weigert als participantContext ontbreekt', async () => {
    const res = await request(app)
      .post('/api/responses')
      .send({ answers: {} });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert als answers ontbreekt', async () => {
    const res = await request(app)
      .post('/api/responses')
      .send({ participantContext: {
          functie: 'Leerkracht',
          leeftijd: '35',
          onderwijstype: 'Secundair',
          schoolgrootte: 'Tussen 300 en 800 leerlingen',
          net: 'GO!',
          ervaring: 'Medior'
        } });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert als value buiten 1-10 is', async () => {
    const res = await request(app)
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
          stelling1: { statementId: 'stelling1', value: 11 }
        }
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert als statementId ontbreekt', async () => {
    const res = await request(app)
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
          stelling1: { value: 5 }
        }
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert als comment geen string is', async () => {
    const res = await request(app)
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
          stelling1: { statementId: 'stelling1', value: 5, comment: 123 }
        }
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert als leeftijd geen getal is', async () => {
    const res = await request(app)
      .post('/api/responses')
      .send({
        participantContext: { geslacht: 'Man', leeftijd: 'dertig', schooltype: 'VO' },
        answers: {
          stelling1: { statementId: 'stelling1', value: 5 }
        }
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
