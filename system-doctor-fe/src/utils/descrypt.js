import CypherService from "../services/CypherService";
import CryptoJS from 'crypto-js'; // Import the crypto-js library

export const fetchData = async () => {
  const result = await CypherService.getEncryptedData();
  const _data = result.map((item) => {
    const { encryptedSymmetricKey, publicKey, encrypted } = item;
    const symmetricKey = CryptoJS.AES.decrypt(encryptedSymmetricKey, publicKey).toString(CryptoJS.enc.Utf8);
    const parts = encrypted.split(':');
    const iv = CryptoJS.enc.Hex.parse(parts[0]);
    const encryptedText = parts[1];
    const decrypted = CryptoJS.AES.decrypt(encryptedText, symmetricKey, {
      iv: iv,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedData)
  });
  setData(_data);
}