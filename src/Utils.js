import CryptoJS from 'crypto-js';

const key = process.env.REACT_APP_CRYPTO_KEY

export function decryptData(encryptedData) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
}
