import forge from 'node-forge';

const decryptSymmetricKeyWithPrivateKey = (privateKey, encryptedSymmetricKey) => {
  const privateKeyObject = forge.pki.privateKeyFromPem(privateKey);
  const encryptedBytes = forge.util.decode64(encryptedSymmetricKey);
  const decrypted = privateKeyObject.decrypt(encryptedBytes, 'RSA-OAEP');
  return decrypted;
};

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

export const fetchData = (privateKey, _data) => {
  const encryptedSymmetricKey = _data.key;
  const encryptedData = _data.data;
  if (!privateKey.includes('PRIVATE KEY') || !privateKey.includes('BEGIN') || !privateKey.includes('END')) {
    return {
      error: 'Missing part in private BEGIN PRIVATE or END PRIVATE',
      message: null,
    };
  }
  try {
    const decryptedSymmetricKey = decryptSymmetricKeyWithPrivateKey(privateKey, encryptedSymmetricKey);
    const decryptedData = decryptDataWithSymmetricKey(encryptedData, decryptedSymmetricKey);
    return {
      error: null,
      message: JSON.parse(decryptedData)
    };
  } catch (e) {
    return {
      error: 'Could not decrypt data, wrong public key or private key',
      message: null,
    };
  }
};

export default fetchData;
