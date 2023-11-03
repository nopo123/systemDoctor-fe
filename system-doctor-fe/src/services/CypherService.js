import api from '../api/axios';

class CypherService {
  static getEncryptedData = () => api.get('/users/encrypted');

  static generateKeyPair = () => api.post('/users/keyPair');
}

export default CypherService;