import api from '../api/axios';

class UserService {
  static register = (data) => api.post('/users/register', data);

  static login = (data) => api.post('/users/login', data);

  static me = () => api.get('/users/me');
  
  static updatePublic = (data) => api.post('users/updatePublic', data);
}

export default UserService;