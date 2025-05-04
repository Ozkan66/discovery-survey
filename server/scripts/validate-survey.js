import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const survey = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/survey.json'), 'utf8'));

function validateSurvey(survey) {
  if (!Array.isArray(survey.themes)) throw new Error('themes moet een array zijn');
  survey.themes.forEach(theme => {
    if (!theme.id || !theme.name || !Array.isArray(theme.subthemes)) throw new Error('Theme structuur fout');
    theme.subthemes.forEach(sub => {
      if (!sub.id || !sub.name || !Array.isArray(sub.statements)) throw new Error('Subtheme structuur fout');
      sub.statements.forEach(stmt => {
        if (!stmt.id || !stmt.text) throw new Error('Statement structuur fout');
      });
    });
  });
  console.log('Survey structuur is geldig!');
}
validateSurvey(survey);
