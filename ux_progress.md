# UX Takenlijst & Checklist Discovery Survey

_Laatste update: 2025-05-03_

## Persona: Deelnemer

### [x] 1. Welkomspagina
- [x] Informatieve tekst over het doel van de survey, anonimiteit, verwerking, etc.
- [x] Duidelijke CTA-button (“Start de survey”) die naar de contextpagina leidt.

> Welkomspagina component, route en styling zijn aangemaakt en klaar voor review. UX en flow zijn conform wireframe geïmplementeerd.
> 
> ✅ Routering aangepast: de Welcome-pagina is nu direct zichtbaar als startpagina en getest in de browser.

### [x] 2. Contextpagina
- [x] Uitgebreid contextformulier met de volgende velden:
  - [x] Functie (Directeur/Schoolleider, HR-medewerker (school), HR-coördinator (scholengroep), Leerkracht, Secretariaatsmedewerker, ICT-coördinator, Payroll-consulent, Beleidsadviseur, Andere)
  - [x] Leeftijd
  - [x] Onderwijstype (Basis, Secundair, Basis & Secundair)
  - [x] Schoolgrootte (kleiner dan 300 leerlingen, tussen 300 en 800 leerlingen, meer dan 800 leerlingen)
  - [x] Net (GO!, Katholiek Onderwijs, Stedelijk-Provinciaal Onderwijs, Onafhankelijk)
  - [x] Ervaring (Starter: <2 jaar, Medior, Senior: >10 jaar)
- [x] Validatie op alle velden
- [x] CTA-button “Volgende” navigeert naar survey-overzichtspagina

> Contextformulier volledig geïmplementeerd, validatie en foutmeldingen toegevoegd, getest in de browser. Navigatie naar overzicht werkt.
> ✅ Backend-validatie en alle automatische tests zijn aangepast aan de nieuwe contextvelden. Oude velden zoals geslacht en schooltype zijn verwijderd. De hele keten van contextformulier tot backend werkt nu correct.

### [x] 3. Survey Overzichtspagina
- [x] Lijst van hoofdthema’s met hun subthema’s tonen
- [x] Visualisatie van status per subthema (niet gestart, bezig, voltooid)
- [x] Subthema’s zijn klikbaar om naar de vragenpagina te gaan
- [x] Voortgangsbalk met totaaloverzicht van ingevulde subthema’s
- [x] Synchronisatie met backend: overzicht toont alle subthema’s uit /api/survey

> ✅ Overzichtspagina is volledig UX-proof: statuslabels, voortgangsbalk en klikbare subthema’s zijn geïmplementeerd en werken correct met de backenddata.

### [x] 4. Vragenpagina per Subthema
- [x] Alle stellingen voor gekozen subthema tonen met radio buttons (Likert scale)
- [x] CTA’s: Vorige, Volgende, Overzicht
- [x] Navigatie werkt correct tussen subthema’s en overzicht
- [x] Antwoorden worden per subthema opgeslagen in sessionStorage en blijven behouden tot verzenden
- [x] Synchronisatie: alle subthema’s en stellingen worden geladen uit /api/survey

> ✅ Vragenpagina laadt nu altijd de juiste subthema’s uit de backend. Antwoorden per subthema blijven bewaard tot verzenden. Navigatie tussen subthema’s en terug naar overzicht werkt. 
> 🔜 UX voor Vorige/Volgende/Overzicht knoppen moet nog verder uitgewerkt worden.
### [x] 5. Versturen
- [x] Versturen-knop alleen zichtbaar als alle subthema’s zijn ingevuld
- [x] POST alle antwoorden naar backend

> ✅ Versturen-flow is afgerond: validatie, mapping en backend-synchronisatie werken correct. Surveyflow is end-to-end succesvol getest en gevalideerd met echte data.

### [ ] 6. Rankingpagina (Top 10)
- [ ] Lijst van alle subthema’s met checkboxen
- [ ] Limiteer selectie tot exact 10
- [ ] Na selectie van 10: CTA “Afronden” zichtbaar
- [ ] POST selectie naar backend

### [ ] 7. Survey afgerond
- [ ] Bedankpagina na afronden

---

## Persona: Admin

### [ ] 8. Admin Login
- [ ] Admin logt in met eigen credentials

### [ ] 9. Dashboard
- [ ] Overzicht en analyse van resultaten
- [ ] Statistieken, respondentenaantallen, filtering op contextvelden (functie, leeftijd, net, etc.)
- [ ] Sorteeropties (hoogste/laagste score, etc.)
- [ ] Sectie met top 10 subthema’s (meest gekozen door deelnemers)
- [ ] Mogelijkheid tot filteren op contextvelden
- [ ] (Optioneel) Exportmogelijkheden

---

## Technische Stappen (Frontend & Backend)

### [ ] Frontend
- [ ] Nieuwe pagina’s/components: welkom, context, overzicht, subthema, ranking, bedankpagina
- [ ] State management: status subthema’s, validatie, flow
- [ ] Routing: heldere routes voor elke stap

### [ ] Backend
- [ ] Endpoints voor contextdata, survey-antwoorden, top 10 ranking
- [ ] Aggregatie & opslag: context, antwoorden, top 10 per gebruiker
- [ ] Admin endpoints voor dashboard (filters, top 10 data)
- [ ] Security: alleen admin bij dashboard, anonimiseren waar nodig

---

## Aanbevolen Implementatievolgorde

1. Welkomspagina en contextflow (frontend)
2. Survey-overzicht en statusvisualisatie
3. Vragenpagina per subthema met navigatie
4. Versturen-flow en validatie
5. Rankingpagina (top 10) en afronden
6. Backend endpoints voor antwoorden en ranking
7. Admin-dashboard uitbreiden met top 10 analyse en filters
8. Testen van de volledige flow met beide persona’s
