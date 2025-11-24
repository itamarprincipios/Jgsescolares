const bcrypt = require('bcryptjs');

// Gerar hash para senha 'admin000'
const password = 'admin000';
const hash = bcrypt.hashSync(password, 10);

console.log('Hash gerado para senha "admin000":');
console.log(hash);
console.log('\nUse este hash no SQL para criar o usuário admin.');
