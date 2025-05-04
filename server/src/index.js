import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { openDb } from './db.js';
import routes from './routes.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Gebruik de routes
app.use('/api', routes);

// Database initialisatie
async function initDb() {
  const db = await openDb();
  // Maak tabellen aan indien ze nog niet bestaan
  await db.exec(`
    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      context TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER,
      answers TEXT NOT NULL,
      summary TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(participant_id) REFERENCES participants(id)
    );
  `);
  await db.close();
}

// Centrale error handler
app.use((err, req, res, next) => {
  console.error('Centrale error handler:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
  initDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export default app;

