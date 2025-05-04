// Script om een admin wachtwoord te hashen voor .env
import bcrypt from 'bcrypt';

const [,, plainPassword] = process.argv;
if (!plainPassword) {
  console.error('Gebruik: node hash-admin-password.js <wachtwoord>');
  process.exit(1);
}

const saltRounds = 12;
bcrypt.hash(plainPassword, saltRounds).then(hash => {
  console.log('Zet deze hash in je .env als ADMIN_PASSWORD:');
  console.log(hash);
});
