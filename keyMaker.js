let EC = require('elliptic').ec;

let ec= new EC('secp256k1');

let key = ec.genKeyPair();
let publicKey = key.getPublic('hex');
let privateKey = key.getPrivate('hex');

console.log(`Private key ... ${privateKey}`)
console.log(`Public key ... ${publicKey}`)