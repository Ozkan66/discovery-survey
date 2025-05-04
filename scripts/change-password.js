import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '../server/.env' });

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Gebruik: node change-password.js <nieuw_wachtwoord>');
  process.exit(1);
}
const newPassword = args[0];
const envPath = '../server/.env';
let envContent = fs.readFileSync(envPath, 'utf-8');
const updated = envContent.replace(/ADMIN_PASSWORD=.*/g, `ADMIN_PASSWORD=${newPassword}`);
fs.writeFileSync(envPath, updated);
console.log('Wachtwoord succesvol gewijzigd!');
