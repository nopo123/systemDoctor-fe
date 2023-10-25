import api from '../api/axios';

class UserService {
  static register = async (data) => api.post('/users/register', data);

  static login = async (data) => api.post('/users/login', data);
}

export default UserService;