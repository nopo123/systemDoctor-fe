import forge from 'node-forge';

// Function to decrypt the symmetric key using the private key
const decryptSymmetricKeyWithPrivateKey = (privateKey, encryptedSymmetricKey) => {
  const privateKeyObject = forge.pki.privateKeyFromPem(privateKey);
  const encryptedBytes = forge.util.decode64(encryptedSymmetricKey);
  const decrypted = privateKeyObject.decrypt(encryptedBytes, 'RSA-OAEP');
  return decrypted;
};

// Function to decrypt data with the decrypted symmetric key
const decryptDataWithSymmetricKey = (encryptedData, decryptedSymmetricKey) => {
  const parts = encryptedData.split(':');
  const iv = forge.util.createBuffer(forge.util.hexToBytes(parts[0]));
  const ciphertext = forge.util.createBuffer(forge.util.hexToBytes(parts[1]));

  const decipher = forge.cipher.createDecipher('AES-CBC', decryptedSymmetricKey);
  decipher.start({ iv: iv });
  decipher.update(ciphertext);
  const success = decipher.finish();

  if (success) {
    return decipher.output.toString();
  } else {
    console.error('Decryption failed.');
    return null;
  }
};

// Usage
export const fetchData = (privateKey, _data) => {
  // Assuming you received these values from the backend
  const encryptedSymmetricKey = _data.key; // Encrypted symmetric key
  const encryptedData = _data.data; // Encrypted data
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
    return null;
  }
  const decryptedSymmetricKey = decryptSymmetricKeyWithPrivateKey(privateKey, encryptedSymmetricKey);
  const decryptedData = decryptDataWithSymmetricKey(encryptedData, decryptedSymmetricKey);
  return JSON.parse(decryptedData);
};

export default fetchData;
