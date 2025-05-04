# Discovery-Survey Webapp voor HR-module Informat

Deze applicatie ondersteunt het Triple-Diamond discovery-proces voor de nieuwe HR-module van Informat.

## Ontwikkelproces

### 1. Installatie

```bash
npm install --prefix client
npm install --prefix server
```

### 2. Development starten

- Front-end: `npm run dev` in `client`
- Back-end: `npm run dev` of `npm start` in `server`

### 3. Linting & Formatting

- Lint: `npm run lint` (client/server)
- Format: `npm run format` (client/server)

### 4. Testen

- Test: `npm test` (client/server)

### 5. Omgevingsvariabelen

- Gebruik `.env.example` als basis voor `.env` (root en server)
- Voor `ADMIN_PASSWORD` in de backend gebruik je een bcrypt-hash. Genereer deze veilig met:
  ```bash
  node scripts/hash-admin-password.js jouwWachtwoord
  ```
- Zet de hash in je `.env` als waarde voor `ADMIN_PASSWORD`.
- Voorbeeld `.env`:
  ```env
  JWT_SECRET=veranderditwachtwoord
  ADMIN_PASSWORD=
  ```
- Herstart daarna de backend server zodat de nieuwe hash wordt ingeladen.
- Je kunt nu inloggen met het wachtwoord dat je gehasht hebt (bijvoorbeeld ``).

### 6. CI/CD

- GitHub Actions workflow checkt lint & tests bij elke push/pull request naar `main`.

## Stack
- **Front-end:** React + Vite + TypeScript + Tailwind CSS
- **Back-end:** Node.js (Express) + JWT
- **Database:** SQLite (file-based)

## Features
- Gelaagde, anonieme survey
- Admin-dashboard met filtering, statistieken en CSV-export
- CLI beheer (wachtwoord wijzigen, survey-config, backup)

## Installatie

### Vereisten
- Node.js >= 18
- npm >= 9

### Installatie
```bash
cd discovery-survey
npm install
```

### Starten
```bash
# Back-end
npm run dev:server
# Front-end
npm run dev:client
```

## Configuratie
- Survey-inhoud: `survey-config.json`
- Wachtwoordbeheer: `.env` + CLI script

## Mapstructuur
- `/client` – Front-end broncode
- `/server` – Back-end & API
- `/data` – SQLite database & backups
- `/scripts` – CLI scripts

## Deployment
Handmatig via Git pull & PM2 op VPS.

---
Voor meer details, zie het PRD-document.
