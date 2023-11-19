import api from '../api/axios';

class PatientService {
  static createPatient = async (patient) => api.post('/patient', patient);

  static updatePatient = (birthId, data) => api.put('/patient/'+birthId, data);

  static createMedical = (data) => api.post('/patient/medicalResults', data);

  static getMedicals = (birthId) => api.get('/patient/medical/'+birthId);

  static generatePdf = (birthId) => api.get('/patient/generatePdf/'+birthId);
}

export default PatientService;