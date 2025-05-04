# Project Voortgang

_Laatste update: 2025-05-03_

## 1. Features & Functioneel

### Front-end
- [x] Login-functionaliteit (met JWT)
- [x] Contextformulier (velden, validatie, opslag in sessionStorage)
- [x] Surveyflow (stellingen, validatie, antwoorden opslaan)
- [x] Admin-dashboard
  - [x] Inloggen als admin
  - [x] Filter dropdowns (per dimensie)
  - [x] Statistieken (gemiddelde, min/max, stddev) (mock)
  - [x] Respondent count (mock)
  - [x] CSV export (mock)
  - [x] Dashboard gekoppeld aan backend (statistieken, count, CSV export)

### Back-end
- [x] API endpoints: /api/login, /api/responses, /api/health
- [x] Input validatie & sanitatie (express-validator/joi)
  - Input validatie toegevoegd aan /admin/summary endpoint
  - Unit tests toegevoegd voor validatie (adminSummary.test.js)
  - Debug-logging verwijderd uit login endpoint
- [ ] Input validatie uitbreiden naar alle endpoints (bijv. responses)
- [ ] CLI & scripts
  - [ ] Wachtwoord wijzigen script
  - [ ] Survey-configuratie update script

## 2. Testing & Kwaliteit

- [x] Unit tests (front-end)
  - [x] Login-component (velden, validatie, foutmelding, token-opslag)
  - [x] ContextForm (velden, validatie, opslag in sessionStorage)
  - [x] Surveyflow (laden, validatie, antwoorden opslaan)
  - [x] Welkomspagina (UX, component, route, styling) – aangemaakt en klaar voor review
- [x] Unit tests (back-end)
  - [x] /api/login endpoint (succes, fout, edge cases)
  - [x] /api/responses endpoint (succes, fout, edge cases)
  - [x] /api/health endpoint
  - [x] /admin/summary endpoint (auth, validatie, edge cases)
  - [x] Uitgebreide tests voor input validatie en foutafhandeling
- [ ] Integration tests (end-to-end)
- [ ] Integration tests dashboard
- [ ] Unit tests CLI scripts
- [ ] Accessibility checks (WCAG)
- [ ] Browser- en device tests
- [ ] Bugfixing

## 3. Database & Data Management

- [x] SQLite database opgezet
- [ ] Database migraties/documentatie
- [ ] Database backup script
- [ ] Filesystem-permissies database
- [ ] Alleen parameterized queries (SQL-injectie preventie)
- [ ] Data minimalisatie (alleen noodzakelijke data opslaan)
- [ ] Periodieke integriteitscheck
- [ ] Documentatie van datamodel
- [ ] Testen van databasefouten en recovery
- [ ] Monitoring van databasegebruik (optioneel)

## 4. DevOps & Deployment

- [ ] README updaten
- [ ] Handmatige deployment (VPS, PM2)

## 5. Security & Privacy

- [x] Gebruik environment variables voor alle secrets
- [x] Input validatie & sanitatie (zie back-end)
- [x] Password hashing met bcrypt
  - [x] hash-admin-password.js script toegevoegd en gedocumenteerd
- [ ] CORS restrictief ingesteld
- [ ] HTTP headers hardenen (helmet)
- [ ] JWT secret sterk & tokens korte vervaltijd
- [ ] Nooit gevoelige info loggen of tonen
- [ ] Dependency scanning (npm audit, CI)
- [ ] XSS-preventie (React escaping)
- [ ] Geen secrets in de client
- [ ] Privacyverklaring/documentatie
- [ ] 2FA voor admin login (optioneel)
- [ ] Monitoring/alerting (optioneel)
- [ ] Automatische logout admin (optioneel)
- [ ] Environment variables documenteren
- [ ] Gebruikersdocumentatie (admin & deelnemer)
- [ ] Acceptatiecriteria reviewen

## 1. Features & Functioneel
- [x] TypeScript types/interfaces centraal (client & server)
- [x] GitHub Actions workflow voor lint & test
- [x] README aanvullen met dev flow en scripts

Hieronder vind je een gedetailleerde, afvinkbare takenlijst voor het project. Taken zijn onderverdeeld in logische hoofd- en subtaken, inclusief tests en kwaliteitsbewaking.

## 1. Survey-configuratie & Wireframes
- [x] Definitieve survey-JSON opstellen
  - [x] Alle thema's, subthema's en stellingen verzamelen
  - [x] Validatie op structuur (tools/scripts)
- [x] Wireframes ontwerpen
  - [x] Loginpagina
  - [x] Contextformulier
  - [x] Surveyflow (per subthema)
  - [x] Samenvatting & ranking
  - [x] Admin-dashboard
  - [x] Mobile-first testen

## 2. Front-end (React + Vite + Tailwind)
- [x] Project setup & tooling
  - [x] TypeScript configuratie
  - [x] Tailwind CSS integratie
  - [ ] Linting & Prettier
- [x] Authenticatie
  - [x] Loginformulier (basis)
  - [ ] JWT-token opslaan & refresh
  - [ ] ➡️ Unit tests login flow
- [x] Contextformulier
  - [x] Dropdowns/radio's voor alle diversiteitsvelden
  - [x] Validatie & opslag in sessie
  - [ ] ➡️ Unit tests validatie
- [x] Survey engine
  - [x] Dynamisch renderen stellingen per subthema
  - [x] Painpoint-titels als headings boven stellinggroepen
  - [x] Eén optioneel commentaarveld onderaan per subthema
  - [x] Navigatie tussen survey-pagina's (vorige/volgende/verzenden per subthema)
  - [x] Progress-indicator
  - [ ] ➡️ Unit tests surveyflow
- [ ] Samenvatting & ranking
  - [x] Bar-chart (gemiddelde scores)  
    _Nieuwe versie: kleurverloop per score, grijze achtergrond voor niet-ingevulde subthema's._
  - [x] Top 3 rankingveld
  - [ ] Mobile responsiveness
  - [ ] ➡️ Unit tests samenvatting
- [x] API-integratie
  - [x] Survey ophalen uit config
  - [x] Responses posten naar backend
  - [ ] Foutafhandeling & loading states
  - [ ] Integration tests API-calls

## 3. Back-end (Node.js/Express)
- [ ] Project setup & tooling
  - [ ] Express configuratie
  - [ ] CORS, dotenv, logging
  - [ ] Unit tests healthcheck
- [x] Survey endpoints
  - [x] GET /survey (serve JSON)
  - [x] POST /responses (opslaan antwoorden)
  - [x] Input validatie met express-validator voor login en responses endpoints
  - [ ] Input validatie overige admin endpoints
  - [x] Unit tests login, responses en admin endpoints
  - [x] Unit/integration tests health endpoint
  - [x] Foutafhandeling edge cases
  - [x] Integration tests overige endpoints
    _Alle belangrijke backend endpoints en edge cases zijn nu volledig getest (incl. validatie, foutafhandeling, 401/400/500 responses)._ 

## Laatste status
- Surveyflow werkt per subthema, met painpoint-titels en één commentaarveld onderaan.
- Antwoorden worden correct opgeslagen en backend ontvangt alles netjes.
- Navigatie, context en login werken.

## Voortgang
- Input validatie en foutafhandeling zijn uitgebreid en getest voor alle relevante endpoints (admin, responses, login, survey).
- Edge-case tests toegevoegd voor responses endpoint (dubbele invoer, kapotte JSON, ontbrekende velden, verkeerde types).
- Integratietests voor survey ophalen en login werken en dekken de belangrijkste scenario's.
- Frontend tests voor contextformulier en surveyflow zijn afgerond.

### Volgende stap

Nu de frontend test coverage op orde is, is het aan te raden om input validatie toe te voegen aan alle backend API endpoints (zoals survey responses en admin functionaliteit). Dit voorkomt foutieve of malafide data en verhoogt de betrouwbaarheid van de applicatie.

**Voorstel:**
- Implementeer input validatie met express-validator voor alle relevante backend endpoints.
- Voeg unit tests toe die edge cases en ongeldige input afvangen.

## Volgende actie/aanbeveling
➡️ **Breid testdekking uit voor admin endpoints (bijv. met verschillende rollen/tokens, foutafhandeling bij ontbrekende of ongeldige JWT, en edge cases).**
➡️ **Beginnen met frontend-implementatie van de samenvattingspagina, die gebruikmaakt van de nieuwe /api/survey en /api/admin/summary endpoints.**
➡️ **Eventueel: test voor robuustheid bij ontbrekende of corrupte survey.json.**
➡️ **Eventueel: refactor van routes/controllers voor betere onderhoudbaarheid.**

## 3. Back-end (Node.js/Express)
- [ ] Project setup & tooling
  - [ ] Express configuratie
  - [ ] CORS, dotenv, logging
  - [ ] Unit tests healthcheck
- [ ] Authenticatie & autorisatie
  - [ ] JWT login endpoint
  - [ ] Middleware voor protected routes
  - [ ] Unit tests JWT flow
- [ ] Survey API
  - [ ] Endpoint: GET /api/survey-config
  - [ ] Endpoint: POST /api/context
  - [ ] Endpoint: POST /api/response
  - [ ] Validatie van inkomende data
  - [ ] Integration tests survey endpoints
- [ ] Admin API
  - [ ] Endpoint: GET /api/admin/summary
  - [ ] Endpoint: GET /api/admin/export/csv
  - [ ] Endpoint: GET /api/admin/export/agg.csv
  - [ ] Endpoint: GET /api/admin/filters
  - [ ] Integration tests admin endpoints

## 4. Database (SQLite)
- [ ] Tabellen & migratie
  - [ ] participants, responses tabellen
  - [ ] Indexen voor performance
  - [ ] Backup script
- [ ] Unit tests database operations

## 5. CLI & Scripts
- [ ] Wachtwoord wijzigen script
- [ ] Survey-configuratie update script
- [ ] Database backup script
- [ ] Unit tests CLI scripts

## 6. Admin-dashboard (Front-end)
- [ ] Inloggen als admin
- [ ] Filter dropdowns (per dimensie)
- [ ] Statistieken (gemiddelde, min/max, stddev)
- [ ] Respondent count
- [ ] CSV export buttons
- [ ] Integration tests dashboard

## 7. Testen & Kwaliteit
- [x] Unit tests (front-end)
  - [x] Unit tests Login-component (velden, validatie, foutmelding, token-opslag)
  - [x] Unit tests ContextForm (velden, validatie, opslag in sessionStorage)
  - [x] Unit tests Surveyflow (laden, validatie, antwoorden opslaan)
- [ ] Unit tests (back-end)
- [ ] Integration tests (end-to-end)
- [ ] Accessibility checks (WCAG)
- [ ] Browser- en device tests
- [ ] Bugfixing

## 8. Deployment & Documentatie
- [ ] README updaten
- [ ] Handmatige deployment (VPS, PM2)

## 9. Security & Privacy
- [ ] Gebruik environment variables voor alle secrets
- [x] Input validatie & sanitatie (express-validator/joi)
  - Input validatie toegevoegd aan /admin/summary endpoint
  - Unit tests toegevoegd voor validatie (adminSummary.test.js)
  - Debug-logging verwijderd uit login endpoint
- [ ] Rate limiting op API endpoints
- [ ] CORS restrictief ingesteld
- [ ] HTTP headers hardenen (helmet)
- [ ] JWT secret sterk & tokens korte vervaltijd
- [x] Password hashing met bcrypt
  - [x] hash-admin-password.js script toegevoegd en gedocumenteerd
- [ ] Nooit gevoelige info loggen of tonen
- [ ] Alleen parameterized queries (SQL-injectie preventie)
- [ ] Filesystem-permissies database
- [ ] Dependency scanning (npm audit, CI)
- [ ] XSS-preventie (React escaping)
- [ ] Geen secrets in de client
- [ ] Privacyverklaring/documentatie
- [ ] Data minimalisatie
- [ ] 2FA voor admin login (optioneel)
- [ ] Monitoring/alerting (optioneel)
- [ ] Automatische logout admin (optioneel)
- [ ] Environment variables documenteren
- [ ] Gebruikersdocumentatie (admin & deelnemer)
- [ ] Acceptatiecriteria reviewen

> Vink items af door `[ ]` te veranderen in `[x]` zodra een taak is afgerond.
