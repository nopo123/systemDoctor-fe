import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserService from '../services/UserService'
import Button from '@mui/material/Button'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const Logout = async () => {
    await logout()
    enqueueSnackbar('Logged out.', { variant: 'success' })
    navigate('/login')
  }

  const navigateHandler = async (url) => {
    navigate(url)
  }

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const fetchedPatient = await UserService.getPatientById(id);
        
        // Normalize the data to ensure arrays don't contain empty strings
        const normalizeArray = (arr) => arr.filter(item => item.trim() !== '');
        
        setPatient({
          ...fetchedPatient,
          allergies: normalizeArray(fetchedPatient.allergies),
          diagnosis: normalizeArray(fetchedPatient.diagnosis),
          medicalResults: normalizeArray(fetchedPatient.medicalResults),
        });
        console.log(fetchedPatient);
      } catch (error) {
        // Handle the error appropriately
        console.error('Error fetching patient details:', error);
      }
    };
  
    fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

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
    <h1 style={{ borderBottom: '2px solid black', paddingBottom: '5px', marginTop: '20px' }}>Patient Details</h1>
    <PictureAsPdfIcon style={{cursor: 'pointer' }} onClick={() => console.log("PDF")}/>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginTop: '20px' }}>
      {/* Patient Name */}
      <div>
        <h2>Name</h2>
        <p>{patient.firstName} {patient.lastName}</p>
      </div>
      
      {/* Address */}
      <div>
        <h2>Address</h2>
        <p>{patient.address}</p>
      </div>
      
      {/* Birth ID */}
      <div>
        <h2>Birth ID</h2>
        <p>{patient.birthId}</p>
      </div>
      
      {/* Diagnosis List */}
      <div>
        <h2>Diagnosis</h2>
        <ul style={{listStyleType: 'none', paddingLeft: 0}}>
          {patient.diagnosis.length ? patient.diagnosis.map((diagnosis, index) => (
            <li key={index}>{diagnosis}</li>
          )) : <p>No diagnosis available</p>}
        </ul>
      </div>
      
      {/* Allergies List */}
      <div>
        <h2>Allergies</h2>
        <ul style={{listStyleType: 'none', paddingLeft: 0}}>
          {patient.allergies.length ? patient.allergies.map((allergy, index) => (
            <li key={index}>{allergy}</li>
          )) : <p>No allergies reported</p>}
        </ul>
      </div>
      
      {/* Medical Results */}
      <div>
        <h2>Medical Results</h2>
        {patient.medicalResults.length ? patient.medicalResults.map((result, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <h3>{result.testName}</h3>
            <p>Date: {result.date}</p>
            <p>Result: {result.result}</p>
            <p>Doctor's Notes: {result.doctorsNotes}</p>
          </div>
        )) : <p>No medical results found</p>}
      </div>
    </div>
  </div>
    </div>
  );
};

export default PatientDetail;