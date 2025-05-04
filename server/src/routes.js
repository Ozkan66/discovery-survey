import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { openDb } from './db.js';
import { generateToken, authMiddleware } from './auth.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Pas origin aan indien nodig
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 requests per 15 min
app.use(express.json());

import fs from 'fs/promises';
const router = express.Router();

// Publieke endpoint: haal survey structuur op
router.get('/survey', async (req, res, next) => {
  try {
    const data = await fs.readFile('./data/survey.json', 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    next(new Error('Kon survey.json niet lezen: ' + e.message));
  }
});

// Testroute voor geforceerde error
router.get('/error', (req, res, next) => {
  next(new Error('Test error'));
});

// Login endpoint
router.post('/login',
  body('username').isString().notEmpty(),
  body('password').isString().isLength({ min: 6 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;

    if (
      username === 'admin' &&
      await bcrypt.compare(password, process.env.ADMIN_PASSWORD)
    ) {
      const token = generateToken({ role: 'admin' });
      return res.json({ token });
    }
    // Check of gebruiker bestaat
    if (username !== 'admin') {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // Als wachtwoord niet klopt
    return res.status(401).json({ error: 'Invalid username or password' });
  });

// Health check
router.get('/health', [
  body().custom((value, { req }) => {
    if (Object.keys(req.body).length !== 0 || Object.keys(req.query).length !== 0) {
      throw new Error('No body or query parameters allowed');
    }
    return true;
  })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.json({ status: 'ok' });
});

// Example: protected admin route
router.get('/admin/summary',
  authMiddleware,
  // Optionele query parameters 'from' en 'to' als ISO datumstrings
  [
    body('from')
      .optional()
      .isISO8601().withMessage('from must be a valid ISO date')
      .custom((value) => {
        if (value && new Date(value) < new Date(new Date().toDateString())) {
          throw new Error('from mag niet in het verleden liggen');
        }
        return true;
      }),
    body('to')
      .optional()
      .isISO8601().withMessage('to must be a valid ISO date')
      .custom((value) => {
        if (value && new Date(value) < new Date(new Date().toDateString())) {
          throw new Error('to mag niet in het verleden liggen');
        }
        return true;
      }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Implementeer summary aggregatie
    (async () => {
      try {
        // 1. Laad survey structuur
        const surveyRaw = await fs.readFile('./data/survey.json', 'utf-8');
        const survey = JSON.parse(surveyRaw);
        // 2. Maak mapping van statementId -> { themeId, subthemeId }
        const statementMap = {};
        for (const theme of survey.themes) {
          for (const sub of theme.subthemes) {
            for (const st of sub.statements) {
              statementMap[st.id] = { themeId: theme.id, subthemeId: sub.id };
            }
          }
        }
        // 3. Haal alle responses op uit de database
        const db = await openDb();
        const rows = await db.all('SELECT answers FROM responses');
        await db.close();
        // 4. Aggegreer per theme/subtheme
        const summary = {};
        for (const row of rows) {
          let answers;
          try {
            answers = typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers;
          } catch (e) {
            continue; // skip corrupte antwoorden
          }
          for (const key in answers) {
            const ans = answers[key];
            const map = statementMap[ans.statementId];
            if (!map || typeof ans.value !== 'number') continue;
            const { themeId, subthemeId } = map;
            if (!summary[themeId]) summary[themeId] = {};
            if (!summary[themeId][subthemeId]) summary[themeId][subthemeId] = { total: 0, count: 0 };
            summary[themeId][subthemeId].total += ans.value;
            summary[themeId][subthemeId].count += 1;
          }
        }
        // 5. Bereken gemiddelden
        for (const themeId in summary) {
          for (const subId in summary[themeId]) {
            const s = summary[themeId][subId];
            s.avg = s.count > 0 ? s.total / s.count : null;
            delete s.total;
          }
        }
        return res.json({ summary });
      } catch (e) {
        return res.status(500).json({ error: 'Kon samenvatting niet berekenen', details: e.message });
      }
    })();
  }
);

// Survey response opslaan
router.post('/responses',
  body('participantContext').isObject().withMessage('participantContext is verplicht'),
  body('participantContext.functie').isString().notEmpty().withMessage('functie is verplicht'),
  body('participantContext.leeftijd')
    .custom(val => (typeof val === 'string' || typeof val === 'number') && String(val).length > 0)
    .withMessage('leeftijd is verplicht'),
  body('participantContext.onderwijstype').isString().notEmpty().withMessage('onderwijstype is verplicht'),
  body('participantContext.schoolgrootte').isString().notEmpty().withMessage('schoolgrootte is verplicht'),
  body('participantContext.net').isString().notEmpty().withMessage('net is verplicht'),
  body('participantContext.ervaring').isString().notEmpty().withMessage('ervaring is verplicht'),
  body('answers').isObject().withMessage('answers is verplicht'),
  body('answers').custom(answers => {
    if (typeof answers !== 'object' || Array.isArray(answers)) {
      throw new Error('answers moet een object zijn');
    }
    for (const key of Object.keys(answers)) {
      const ans = answers[key];
      if (typeof ans !== 'object' || ans === null) {
        throw new Error(`Antwoord voor ${key} moet een object zijn`);
      }
      if (typeof ans.statementId !== 'string' || !ans.statementId) {
        throw new Error(`statementId ontbreekt of is geen string voor ${key}`);
      }
      if (typeof ans.value !== 'number' || ans.value < 1 || ans.value > 10) {
        throw new Error(`value voor ${key} moet een getal 1-10 zijn`);
      }
      if (ans.comment && typeof ans.comment !== 'string') {
        throw new Error(`comment voor ${key} moet een string zijn indien aanwezig`);
      }
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validatiefout bij POST /responses:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    const { participantContext, answers } = req.body;
    console.log('Ontvangen participantContext:', participantContext);
    console.log('Ontvangen answers:', answers);
    try {
      const db = await openDb();
      // Sla participant context op
      const result = await db.run(
        'INSERT INTO participants (context) VALUES (?)',
        [JSON.stringify(participantContext)]
      );
      const participantId = result.lastID;
      // Sla antwoorden op
      await db.run(
        'INSERT INTO responses (participant_id, answers) VALUES (?, ?)',
        [participantId, JSON.stringify(answers)]
      );
      await db.close();
      console.log('Succesvol opgeslagen voor participantId:', participantId);
      return res.json({ success: true });
    } catch (e) {
      console.error('Fout bij opslaan response:', e);
      return res.status(500).json({ error: 'Opslaan van response mislukt', details: e.message });
    }
  }
);

export default router;
