import forge from 'node-forge';

// Funkcia na šifrovanie údajov s verejným kľúčom na frontend strane
function encryptWithPublicKey(publicKey, data) {
  const publicKeyForge = forge.pki.publicKeyFromPem(publicKey);
  const buffer = forge.util.createBuffer(data, 'utf8');
  const encrypted = publicKeyForge.encrypt(buffer.bytes());
  return forge.util.encode64(encrypted);
}

// Usage example
export const encryptData = (publicKey, data) => {
  try {
    const encryptedData = encryptWithPublicKey(publicKey, data);
    return {data: encryptedData};
  } catch (error) {
    console.error("Error in encryption process:", error);
  }
}
