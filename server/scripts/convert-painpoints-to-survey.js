import fs from 'fs';
import path from 'path';

// Lees het paintpoints-bestand in als JS object (NB: geen standaard JSON, dus we vervangen 'painpoints =' en single quotes)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const painpointsRaw = fs.readFileSync(path.resolve(__dirname, '../../paintpoints.json'), 'utf8');
const painpointsString = painpointsRaw
  .replace(/^painpoints\s*=\s*/, '')
  .replace(/;?\s*$/, '');
const painpoints = eval('(' + painpointsString + ')'); // Let op: alleen veilig lokaal gebruiken!

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

const survey = { themes: [] };
Object.entries(painpoints).forEach(([themeName, subthemes]) => {
  const themeId = slugify(themeName);
  const theme = { id: themeId, name: themeName, subthemes: [] };
  Object.entries(subthemes).forEach(([subthemeName, painpointGroups]) => {
    const subthemeId = slugify(subthemeName);
    const subtheme = { id: subthemeId, name: subthemeName, statements: [] };
    Object.entries(painpointGroups).forEach(([painpointTitle, observations]) => {
      observations.forEach((obs, idx) => {
        subtheme.statements.push({
          id: slugify(`${subthemeId}_${painpointTitle}_${idx+1}`),
          text: obs,
          painpoint: painpointTitle
        });
      });
    });
    theme.subthemes.push(subtheme);
  });
  survey.themes.push(theme);
});

fs.writeFileSync(
  path.resolve(__dirname, '../data/survey.json'),
  JSON.stringify(survey, null, 2),
  'utf8'
);
console.log('survey.json succesvol aangemaakt!');
