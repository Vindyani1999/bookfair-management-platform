const CryptoJS = require('crypto-js');

const encryptPassword = (password) => {
  const secretKey = process.env.AES_SECRET || 'default_secret_key';
  return CryptoJS.AES.encrypt(password, secretKey).toString();
};

const decryptPassword = (ciphertext) => {
  const secretKey = process.env.AES_SECRET || 'default_secret_key';
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encryptPassword, decryptPassword };
