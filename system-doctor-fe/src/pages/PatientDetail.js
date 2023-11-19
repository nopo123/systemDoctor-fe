import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserService from '../services/UserService'
import PatientService from '../services/PatientService';
import Button from '@mui/material/Button'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import TextField from '@mui/material/TextField';
import AppService from '../services/AppService';
import { fetchData } from '../utils/decrypt';

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Dialog management
  const [isNameEditModalOpen, setIsNameEditModalOpen] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isAddressEditModalOpen, setIsAddressEditModalOpen] = useState(false);
  const [editedAddress, setEditedAddress] = useState('');
  const [isDiagnosesEditModalOpen, setIsDiagnosesEditModalOpen] = useState(false);
  const [editedDiagnoses, setEditedDiagnoses] = useState([]);
  const [isAllergiesEditModalOpen, setIsAllergiesEditModalOpen] = useState(false);
  const [editedAllergies, setEditedAllergies] = useState([]);
  const [isMedicalResultsEditModalOpen, setIsMedicalResultsEditModalOpen] = useState(false);
  const [editedMedicalResults, setEditedMedicalResults] = useState([]);

  const [newMedicalResult, setNewMedicalResult] = useState({ title: '', text: '' });
  const [newAllergy, setNewAllergy] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');

  const Logout = async () => {
    await logout()
    enqueueSnackbar('Logged out.', { variant: 'success' })
    navigate('/login')
  }

  const navigateHandler = async (url) => {
    navigate(url)
  }

  const handleOpenNameEditModal = () => {
    setEditedName(`${patient.firstName} ${patient.lastName}`);
    setIsNameEditModalOpen(true);
  };

  const handleCloseNameEditModal = () => {
    setIsNameEditModalOpen(false);
  };

  const updatePatientName = async () => {
    try {
      const [firstName, lastName] = editedName.split(' '); 
      const updatedData = {
        ...patient, 
        firstName, 
        lastName, 
      };
      
      await PatientService.updatePatient(id, updatedData);

      enqueueSnackbar('Patient name updated successfully', { variant: 'success' });
  
      setPatient((prev) => ({
        ...prev,
        firstName: firstName,
		    lastName: lastName,
      }));
  
      handleCloseNameEditModal();
    } catch (error) {
      enqueueSnackbar('Error updating patient name', { variant: 'error' });
    }
  };

  const handleOpenAddressEditModal = () => {
    setEditedAddress(patient.address);
    setIsAddressEditModalOpen(true);
  };

  const handleCloseAddressEditModal = () => {
    setIsAddressEditModalOpen(false);
  };

  const updatePatientAddress = async () => {
    try {
      const updatedData = {
        ...patient,
        address: editedAddress,
      };

      await PatientService.updatePatient(id, updatedData);
      enqueueSnackbar('Patient address updated successfully', { variant: 'success' });

      setPatient(prev => ({
        ...prev,
        address: editedAddress,
      }));

      handleCloseAddressEditModal();
    } catch (error) {
      enqueueSnackbar('Error updating patient address', { variant: 'error' });
    }
  };

  const handleOpenDiagnosesEditModal = () => {
    setEditedDiagnoses([...patient.diagnosis]); 
    setIsDiagnosesEditModalOpen(true);
  };

  const handleCloseDiagnosesEditModal = () => {
    setIsDiagnosesEditModalOpen(false);
  };

  const handleRemoveDiagnosis = (index) => {
    setEditedDiagnoses((currentDiagnoses) => currentDiagnoses.filter((_, i) => i !== index));
  };

  const handleAddDiagnosis = (newDiagnosis) => {
    if (newDiagnosis && !editedDiagnoses.includes(newDiagnosis)) {
      setEditedDiagnoses((currentDiagnoses) => [...currentDiagnoses, newDiagnosis]);
    }
  };

  const updatePatientDiagnoses = async () => {
    try {
      const updatedData = {
        ...patient,
        diagnosis: editedDiagnoses,
      };

      await PatientService.updatePatient(id, updatedData);

      enqueueSnackbar('Patient diagnoses updated successfully', { variant: 'success' });

      setPatient((prev) => ({
        ...prev,
        diagnosis: editedDiagnoses,
      }));

      handleCloseDiagnosesEditModal();
    } catch (error) {
      enqueueSnackbar('Error updating patient diagnoses', { variant: 'error' });
    }
  };

  const handleOpenAllergiesEditModal = () => {
    setEditedAllergies([...patient.allergies]); 
    setIsAllergiesEditModalOpen(true);
  };

  const handleCloseAllergiesEditModal = () => {
    setIsAllergiesEditModalOpen(false);
  };

  const handleRemoveAllergy = (index) => {
    setEditedAllergies((currentAllergies) => currentAllergies.filter((_, i) => i !== index));
  };

  const handleAddAllergy = (newAllergy) => {
    if (newAllergy && !editedAllergies.includes(newAllergy)) {
      setEditedAllergies((currentAllergies) => [...currentAllergies, newAllergy]);
      setNewAllergy(''); 
    }
  };

  const updatePatientAllergies = async () => {
    try {
      const updatedData = {
        ...patient,
        allergies: editedAllergies,
      };

      await PatientService.updatePatient(id, updatedData);
      enqueueSnackbar('Patient allergies updated successfully', { variant: 'success' });

      setPatient((prev) => ({
        ...prev,
        allergies: editedAllergies,
      }));

      handleCloseAllergiesEditModal();
    } catch (error) {
      enqueueSnackbar('Error updating patient allergies', { variant: 'error' });
    }
  };

  const handleOpenMedicalResultsEditModal = () => {
    setEditedMedicalResults([...patient.medicalResults]);
    setIsMedicalResultsEditModalOpen(true);
  };

  const handleCloseMedicalResultsEditModal = () => {
    setIsMedicalResultsEditModalOpen(false);
  };

  const handleAddMedicalResult = () => {
    if (newMedicalResult.title.trim() === '' || newMedicalResult.text.trim() === '') {
      enqueueSnackbar('Both title and text are required', { variant: 'warning' });
      return;
    }

    newMedicalResult.date = new Date().toISOString();
  
    setEditedMedicalResults((currentMedicalResults) => [
      ...currentMedicalResults,
      newMedicalResult,
    ]);
    setNewMedicalResult({ title: '', text: '' });
  };

  const handleRemoveMedicalResult = (index) => {
    setEditedMedicalResults((currentMedicalResults) =>
      currentMedicalResults.filter((_, i) => i !== index)
    );
  };
  
  const updatePatientMedicalResults = async () => {
    try {
      const updatedData = {
        birthId: patient.birthId,
        medicalResults: editedMedicalResults,
      };
  
      await PatientService.createMedical(updatedData);
      enqueueSnackbar('Patient medical results updated successfully', { variant: 'success' });
  
      setPatient((prev) => ({
        ...prev,
        medicalResults: editedMedicalResults,
      }));
  
      handleCloseMedicalResultsEditModal();
    } catch (error) {
      enqueueSnackbar('Error updating patient medical results', { variant: 'error' });
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        let fetchedPatient = await UserService.getPatientById(id);
        let medicals = await PatientService.getMedicals(id);
        const privateKey = AppService.getKey();
        const parsedData = fetchData(privateKey, fetchedPatient);
        if (!parsedData.message) {
          enqueueSnackbar(parsedData.error, { variant: 'error' })
          return
        } 
        const parsedMedicals = fetchData(privateKey, medicals);
        if (!parsedMedicals.message) {
          enqueueSnackbar(parsedMedicals.error, { variant: 'error' })
          return
        }
        fetchedPatient = parsedData.message;
        fetchedPatient.medicalResults = parsedMedicals.message;
        const normalizeArray = (arr) => arr.filter(item => item.trim() !== '');
        
        setPatient({
          ...fetchedPatient,
          allergies: normalizeArray(JSON.parse(fetchedPatient.allergies)),
          diagnosis: normalizeArray(JSON.parse(fetchedPatient.diagnosis)),
          medicalResults: fetchedPatient.medicalResults || [],
        });
      } catch (error) {
        enqueueSnackbar('Error fetching patient details', { variant: 'error' });
      }
    };
  
    fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const exportPDF = async () => {
    try {
      const data = await PatientService.generatePdf(id);
  
      const privateKey = AppService.getKey();
      const response = fetchData(privateKey, data);
  
      if (!response.message) {
        enqueueSnackbar(response.error, { variant: 'error' });
        return;
      }
  
      const byteCharacters = response.message.data
      .map((byte) => String.fromCharCode(byte))
      .join('');
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

      const pdfUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `${id}.pdf`;
      a.click();
    } catch (error) {
      enqueueSnackbar('Error generating PDF', { variant: 'error' });
    }
  };

  return (
    <div>
      <div>
        <Button
          onClick={Logout}
          variant='contained'
          color='success'
          size='large'
          style={{ margin: 5, marginLeft: 15 }}
        >
          Log out
        </Button>
        <Button
          onClick={() => navigateHandler('/create_patient')}
          variant='contained'
          color='info'
          size='large'
          style={{ margin: 5 }}
        >
          Create patient
        </Button>
        <Button
          onClick={() => navigateHandler("/patientsList")}
          variant='contained'
          color='info'
          size='large'
          style={{ margin: 5 }}
        >
          List of patients
        </Button>
        <Button
          onClick={() => navigateHandler("/dashboard")}
          variant='contained'
          color='info'
          size='large'
          style={{ margin: 5 }}
        >
          Dashboard
        </Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
    <h1 style={{ borderBottom: '2px solid black', paddingBottom: '5px', marginTop: '20px' }}>Patient Details <PictureAsPdfIcon style={{cursor: 'pointer' }} onClick={exportPDF}/></h1>
    <div id='divToPDF' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginTop: '20px' }}>
      {/* Patient Name */}
      <div>
        <h2>Name <EditIcon style={{cursor: 'pointer' }} onClick={handleOpenNameEditModal}/></h2>
        <p>{patient.firstName} {patient.lastName}</p>
      </div>
      <Dialog open={isNameEditModalOpen} onClose={handleCloseNameEditModal}>
        <DialogTitle>Edit Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Full Name"
            type="text"
            fullWidth
            variant="standard"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNameEditModal}>Cancel</Button>
          <Button onClick={updatePatientName}>Update</Button>
        </DialogActions>
      </Dialog>
      
      {/* Address */}
      <div>
        <h2>Address <EditIcon style={{cursor: 'pointer' }} onClick={handleOpenAddressEditModal}/></h2>
        <p>{patient.address}</p>
      </div>
      <Dialog open={isAddressEditModalOpen} onClose={handleCloseAddressEditModal}>
        <DialogTitle>Edit Address</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            type="text"
            fullWidth
            variant="standard"
            value={editedAddress}
            onChange={(e) => setEditedAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddressEditModal}>Cancel</Button>
          <Button onClick={updatePatientAddress}>Update</Button>
        </DialogActions>
      </Dialog>
      
      {/* Birth ID */}
      <div>
        <h2>Birth ID</h2>
        <p>{patient.birthId}</p>
      </div>
      
      {/* Diagnosis List */}
      <div>
        <h2>Diagnosis <AddCircleIcon style={{cursor: 'pointer' }} onClick={handleOpenDiagnosesEditModal}/></h2>
        <ul style={{listStyleType: 'none', paddingLeft: 0}}>
          {patient.diagnosis.length ? patient.diagnosis.map((diagnosis, index) => (
            <li key={index}>{diagnosis}</li>
          )) : <p>No diagnosis available</p>}
        </ul>
      </div>
      <Dialog open={isDiagnosesEditModalOpen} onClose={handleCloseDiagnosesEditModal} fullWidth maxWidth="sm">
        <DialogTitle>Edit Diagnoses</DialogTitle>
        <DialogContent>
          {editedDiagnoses.map((diagnosis, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ flexGrow: 1, margin: 0 }}>{diagnosis}</p>
              <CancelIcon style={{ cursor: 'pointer' }} onClick={() => handleRemoveDiagnosis(index)} />
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <TextField
            margin="dense"
            id="new-diagnosis"
            label="New Diagnosis"
            type="text"
            variant="standard"
            value={newDiagnosis}
            onChange={(e) => setNewDiagnosis(e.target.value)}
            style={{ flex: 1, marginRight: '8px' }} 
          />
          <Button
            onClick={() => {
              handleAddDiagnosis(newDiagnosis);
              setNewDiagnosis(''); 
            }}
            color="primary"
            style={{ padding: '6px' }} 
          >
            <CheckIcon />
          </Button>
        </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDiagnosesEditModal}>Cancel</Button>
          <Button onClick={updatePatientDiagnoses}>Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Allergies List */}
      <div>
        <h2>Allergies <AddCircleIcon style={{cursor: 'pointer' }} onClick={handleOpenAllergiesEditModal}/></h2>
        <ul style={{listStyleType: 'none', paddingLeft: 0}}>
          {patient.allergies.length ? patient.allergies.map((allergy, index) => (
            <li key={index}>{allergy}</li>
          )) : <p>No allergies reported</p>}
        </ul>
      </div>

      <Dialog open={isAllergiesEditModalOpen} onClose={handleCloseAllergiesEditModal} fullWidth maxWidth="sm">
        <DialogTitle>Edit Allergies</DialogTitle>
        <DialogContent>
          {editedAllergies.map((allergy, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ flexGrow: 1, margin: 0 }}>{allergy}</p>
              <CancelIcon style={{ cursor: 'pointer' }} onClick={() => handleRemoveAllergy(index)} />
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <TextField
              margin="dense"
              id="new-allergy"
              label="New Allergy"
              type="text"
              variant="standard"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              style={{ flex: 1, marginRight: '8px' }} 
            />
            <Button
              onClick={() => handleAddAllergy(newAllergy)}
              color="primary"
              style={{ padding: '6px' }} 
            >
              <CheckIcon />
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAllergiesEditModal}>Cancel</Button>
          <Button onClick={updatePatientAllergies}>Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Medical Results */}
      <div>
        <h2>Medical Results <AddCircleIcon style={{cursor: 'pointer' }} onClick={handleOpenMedicalResultsEditModal}/></h2>
        {patient.medicalResults.length ? patient.medicalResults.map((result, index) => (
          <div key={index} style={{ padding: '10px', border: '1px solid #ccc', // Add a border
          borderRadius: '4px' }}>
            <h3>{result.title}</h3>
            <p>Date: {result.date}</p>
            <p>Text: {result.text}</p>
          </div>
        )) : <p>No medical results found</p>}
      </div>
      <Dialog open={isMedicalResultsEditModalOpen} onClose={handleCloseMedicalResultsEditModal} fullWidth maxWidth="md">
        <DialogTitle>Edit Medical Results</DialogTitle>
        <DialogContent>
          {editedMedicalResults.map((result, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, border: '1px solid #ccc', // Add a border
            borderRadius: '4px' }}>
              <div style={{ flexGrow: 1 }}>
                <p><strong>Title:</strong> {result.title}</p>
                <p><strong>Text:</strong> {result.text}</p>
              </div>
              <CancelIcon style={{ cursor: 'pointer' }} onClick={() => handleRemoveMedicalResult(index)} />
            </div>
          ))}
          {/* Inputs for adding a new medical result */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <TextField
              margin="dense"
              id="new-medical-result-title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={newMedicalResult.title}
              onChange={(e) => setNewMedicalResult({ ...newMedicalResult, title: e.target.value })}
            />
            <TextField
              margin="dense"
              id="new-medical-result-text"
              label="Text"
              type="text"
              multiline
              rows={4}
              fullWidth
              variant="standard"
              value={newMedicalResult.text}
              onChange={(e) => setNewMedicalResult({ ...newMedicalResult, text: e.target.value })}
            />
            <Button
              onClick={handleAddMedicalResult}
              color="primary"
              variant="contained"
              startIcon={<CheckIcon />}
            >
              Add Result
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMedicalResultsEditModal}>Cancel</Button>
          <Button onClick={updatePatientMedicalResults}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  </div>
    </div>
  );
};

export default PatientDetail;