import api from '../api/axios';

class CypherService {
  static getEncryptedData = () => api.get('/users/encrypted');

}

export default CypherService;