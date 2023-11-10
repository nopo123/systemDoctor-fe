import api from '../api/axios';

class RequestService {
    static create = (data) => api.post('/requests', data);
}

export default RequestService;