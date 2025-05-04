import request from 'supertest';
import express from 'express';
import routes from '../routes.js';

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('POST /api/responses edge cases', () => {
  it('accepteert dubbele response voor zelfde participant (geen unique constraint)', async () => {
    const payload = {
      participantContext: {
  functie: 'Leerkracht',
  leeftijd: '35',
  onderwijstype: 'Secundair',
  schoolgrootte: 'Tussen 300 en 800 leerlingen',
  net: 'GO!',
  ervaring: 'Medior'
},
      answers: { stelling1: { statementId: 'stelling1', value: 8 } }
    };
    const res1 = await request(app).post('/api/responses').send(payload);
    const res2 = await request(app).post('/api/responses').send(payload);
    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
  });

  it('weigert bij kapotte JSON', async () => {
    const res = await request(app)
      .post('/api/responses')
      .set('Content-Type', 'application/json')
      .send('nietjson');
    expect([400, 415]).toContain(res.statusCode);
  });

  it('weigert als value een string is', async () => {
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
        answers: { stelling1: { statementId: 'stelling1', value: 'zes' } }
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert als schooltype ontbreekt', async () => {
    const res = await request(app)
      .post('/api/responses')
      .send({
        participantContext: { geslacht: 'Man', leeftijd: 30 },
        answers: { stelling1: { statementId: 'stelling1', value: 5 } }
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert bij lege body', async () => {
    const res = await request(app)
      .post('/api/responses')
      .send({});
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

  it('weigert als participantContext ontbreekt', async () => {
    const res = await request(app)
      .post('/api/responses')
      .send({ answers: { stelling1: { statementId: 'stelling1', value: 7 } } });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert als answers geen object is (array)', async () => {
    const res = await request(app)
      .post('/api/responses')
      .send({ participantContext: {
  functie: 'Leerkracht',
  leeftijd: '35',
  onderwijstype: 'Secundair',
  schoolgrootte: 'Tussen 300 en 800 leerlingen',
  net: 'GO!',
  ervaring: 'Medior'
}, answers: [{ statementId: 'stelling1', value: 8 }] });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert als answers geen object is (string)', async () => {
    const res = await request(app)
      .post('/api/responses')
      .send({ participantContext: {
  functie: 'Leerkracht',
  leeftijd: '35',
  onderwijstype: 'Secundair',
  schoolgrootte: 'Tussen 300 en 800 leerlingen',
  net: 'GO!',
  ervaring: 'Medior'
}, answers: 'nietobject' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert als answers null is', async () => {
    const res = await request(app)
      .post('/api/responses')
      .send({ participantContext: {
  functie: 'Leerkracht',
  leeftijd: '35',
  onderwijstype: 'Secundair',
  schoolgrootte: 'Tussen 300 en 800 leerlingen',
  net: 'GO!',
  ervaring: 'Medior'
}, answers: null });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert als value buiten bereik is (<1)', async () => {
    const res = await request(app)
      .post('/api/responses')
      .send({ participantContext: {
  functie: 'Leerkracht',
  leeftijd: '35',
  onderwijstype: 'Secundair',
  schoolgrootte: 'Tussen 300 en 800 leerlingen',
  net: 'GO!',
  ervaring: 'Medior'
}, answers: { stelling1: { statementId: 'stelling1', value: 0 } } });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert als value buiten bereik is (>10)', async () => {
    const res = await request(app)
      .post('/api/responses')
      .send({ participantContext: {
  functie: 'Leerkracht',
  leeftijd: '35',
  onderwijstype: 'Secundair',
  schoolgrootte: 'Tussen 300 en 800 leerlingen',
  net: 'GO!',
  ervaring: 'Medior'
}, answers: { stelling1: { statementId: 'stelling1', value: 11 } } });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('weigert als statementId ontbreekt in answer', async () => {
    const res = await request(app)
      .post('/api/responses')
      .send({ participantContext: {
  functie: 'Leerkracht',
  leeftijd: '35',
  onderwijstype: 'Secundair',
  schoolgrootte: 'Tussen 300 en 800 leerlingen',
  net: 'GO!',
  ervaring: 'Medior'
}, answers: { stelling1: { value: 6 } } });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
