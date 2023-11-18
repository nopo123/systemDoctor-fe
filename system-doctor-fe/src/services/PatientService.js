import api from '../api/axios';

class PatientService {
  static createPatient = async (patient) => api.post('/patient', patient);

  static updatePatient = (birthId, data) => api.put('/patient/'+birthId, data);
}

export default PatientService;