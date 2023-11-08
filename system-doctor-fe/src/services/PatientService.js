import api from '../api/axios';

class PatientService {
  static createPatient = async (patient) => api.post('/patient', patient);

}

export default PatientService;