// Script om positive_statements.json volledig om te zetten naar survey.json-structuur
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../positive_statements.json');
const outputPath = path.join(__dirname, '../server/data/survey.json');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function convert(json) {
  const themes = [];
  for (const [themeName, subthemes] of Object.entries(json)) {
    const themeId = slugify(themeName);
    const theme = {
      id: themeId,
      name: themeName,
      subthemes: []
    };
    for (const [subthemeName, painpoints] of Object.entries(subthemes)) {
      const subthemeId = slugify(subthemeName);
      const subtheme = {
        id: subthemeId,
        name: subthemeName,
        statements: []
      };
      for (const [painpoint, statements] of Object.entries(painpoints)) {
        const painpointId = slugify(painpoint);
        statements.forEach((text, idx) => {
          subtheme.statements.push({
            id: `${painpointId}_${idx + 1}`,
            text,
            painpoint
          });
        });
      }
      theme.subthemes.push(subtheme);
    }
    themes.push(theme);
  }
  return { themes };
}

function main() {
  const raw = fs.readFileSync(inputPath, 'utf-8');
  const json = JSON.parse(raw);
  const survey = convert(json);
  fs.writeFileSync(outputPath, JSON.stringify(survey, null, 2), 'utf-8');
  console.log('survey.json succesvol aangemaakt!');
}

main();
