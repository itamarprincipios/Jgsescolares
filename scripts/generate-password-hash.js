const bcrypt = require('bcryptjs');

// Gerar hash para senha 'admin123'
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('Hash gerado para senha "admin123":');
console.log(hash);
console.log('\nUse este hash no SQL para criar o usuário admin.');
