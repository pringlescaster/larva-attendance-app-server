import crypto from 'crypto';

const secretKey = crypto.randomBytes(64).toString('hex');
console.log(secretKey);


//to generate secret key you use this in the terminal "node generateSecret.js"