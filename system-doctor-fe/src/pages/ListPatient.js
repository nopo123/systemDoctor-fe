import Button from '@mui/material/Button'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import PrivateKeyDialog from '../components/PrivateKeyDialog'
import useAuth from '../hooks/useAuth'
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UserService from '../services/UserService';
import { useState, useEffect } from 'react';
import AppService from '../services/AppService';
import { fetchData } from '../utils/decrypt';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Container } from '@mui/material';
import RequestService from '../services/RequestService'
import { parseErrorMessage } from '../utils/errorMessage'


function createData(birthId, lastName, firstName, address, diagnosis) {
  return { birthId, lastName, firstName, address, diagnosis };
}

const rows = [];

const ListPatient = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await UserService.getPatients();
        const privateKey = AppService.getKey();
        const parsedData = fetchData(privateKey, data);
        if (!parsedData.message) {
          enqueueSnackbar(parsedData.error, { variant: 'error' })
          return
        }
        const patientRows = parsedData.message.map(patient => createData(patient.birthId, patient.lastName, patient.firstName, patient.address, patient.diagnosis));
        setPatients(patientRows); // Update state with formatted patient data
        console.log(parsedData);
      } catch (error) {
        console.error("Error fetching patients:", error);
        // Handle error (e.g., show error notification)
      }
    };

    fetchPatients();
  }, []); 

  const handleOpenModal = (patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPatient(null);
  };

  const handleDelete = async (birthId) => {
    try {
      console.log(birthId);
      await UserService.deletePatient(birthId);
      const updatedPatients = patients.filter(patient => patient.birthId !== birthId);
      setPatients(updatedPatients);
      enqueueSnackbar('Patient deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error("Error deleting patient:", error);
      // Handle error (e.g., show error notification)
    }
  };

  const navigateHandler = async (url) => {
    navigate(url)
  }

  const Logout = async () => {
    await logout()
    enqueueSnackbar('Logged out.', { variant: 'success' })
    navigate('/login')
  }

  const RequestModal = ({ open, handleClose, patient }) => {
    const handleSubmit = async (event) => {
      try {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const birthId = formData.get('birthId');
        const reasonForExamination = formData.get('reasonForExamination');
        const doctorsNotes = formData.get('doctorsNotes');

        if (reasonForExamination.length === 0){
          enqueueSnackbar('Empty!', { variant: 'error' });
          throw new Error("EMPTY!");
        }

        if (doctorsNotes.length === 0){
          enqueueSnackbar('Empty!', { variant: 'error' });
          throw new Error("EMPTY!");
        }

        if (birthId.length === 0){
          enqueueSnackbar('Empty!', { variant: 'error' });
          throw new Error("EMPTY!");
        }
      
        const requestData = {
          birthId: birthId,
          reason: reasonForExamination,
          notes: doctorsNotes,
        };

        await RequestService.create(requestData);
        handleClose();
        enqueueSnackbar('Success', { variant: 'success' });
      } catch (e) {
        enqueueSnackbar('Empty', { variant: 'error' });
        handleClose();
      }
    };

    try{
      return (
        <Modal open={open} onClose={handleClose}>
          <Container maxWidth="sm" style={{ paddingTop: '5%', paddingBottom: '5%' }}>
            <Box component="form" onSubmit={handleSubmit} sx={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <TextField
                margin="normal"
                fullWidth
                id="patientName"
                label="Patient Name"
                name="patientName"
                value={patient.lastName} // Assuming patient object has a name property
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="birthId"
                label="Birth Id"
                name="birthId"
                value={patient.birthId} // Assuming patient object has a name property
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextareaAutosize
                aria-label="Reason for Examination"
                minRows={3}
                placeholder="Reason for Examination"
                style={{ width: '95%', padding: '10px', fontSize: '0.875rem', fontFamily: 'Roboto, sans-serif', borderRadius: '4px', border: '1px solid #ccc' }}
                name="reasonForExamination"
              />
              <TextareaAutosize
                aria-label="Doctor's Notes"
                minRows={3}
                placeholder="Doctor's Notes"
                style={{ width: '95%', padding: '10px', fontSize: '0.875rem', fontFamily: 'Roboto, sans-serif', borderRadius: '4px', border: '1px solid #ccc' }}
                name="doctorsNotes"
              />
              <Button type="submit" variant="contained" color="primary" style={{ marginTop: 16, alignSelf: 'flex-end' }}>
                Submit Request
              </Button>
            </Box>
          </Container>
        </Modal>
     );
    } catch (e) {
      return;
    }
  };

  return (
    <div>
      <PrivateKeyDialog open={open} setOpen={setOpen}/>
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
          onClick={() => navigateHandler("/dashboard")}
          variant='contained'
          color='info'
          size='large'
          style={{ margin: 5 }}
        >
          Dashboard
        </Button>
        <Button
          onClick={() => setOpen(true)}
          variant='contained'
          color='info'
          size='large'
          style={{ margin: 5 }}
        >
          Update private key
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Birth Id</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">First Name</TableCell>
              <TableCell align="right">Address</TableCell>
              <TableCell align="right">Request</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {patient.birthId}
                </TableCell>
                <TableCell align="right">{patient.lastName}</TableCell>
                <TableCell align="right">{patient.firstName}</TableCell>
                <TableCell align="right">{patient.address}</TableCell>
                <TableCell align="right"> <AddCircleIcon onClick={() => handleOpenModal(patient)} /> {/* New Icon for adding request */}</TableCell>
                <TableCell align="right">
                  <DeleteIcon onClick={() => handleDelete(patient.birthId)} />
                  <EditIcon />   {/* Add onClick handler for editing */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <RequestModal open={modalOpen} handleClose={handleCloseModal} patient={selectedPatient} />
    </div>
  )
}

export default ListPatient