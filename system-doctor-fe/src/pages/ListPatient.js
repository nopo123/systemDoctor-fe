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
import { styled } from '@mui/material/styles';
import { parseErrorMessage } from '../utils/errorMessage';


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
  const [searchTerm, setSearchTerm] = useState('');

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
        setPatients(patientRows); 
      } catch (error) {
        enqueueSnackbar(parseErrorMessage(error), { variant: 'error' })
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
      await UserService.deletePatient(birthId);
      const updatedPatients = patients.filter(patient => patient.birthId !== birthId);
      setPatients(updatedPatients);
      enqueueSnackbar('Patient deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error("Error deleting patient:", error);
      // Handle error (e.g., show error notification)
    }
  };

  const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  }));
  
  // Custom styling for TableHead
  const StyledTableCellHead = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  }));
  
  // Custom styling for TableBody
  const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
    fontSize: '0.875rem',
  }));

  const navigateHandler = async (url) => {
    navigate(url)
  }

  const navigateDetail = async (id) => {
    navigate(`/patient/${id}`)
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
      <div style={{ margin: '20px 0' }}>
        <TextField
          label="Search by Birth ID"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <h1>LIST OF PATIENTS</h1>
      <StyledTableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCellHead>Birth Id</StyledTableCellHead>
              <StyledTableCellHead align="right">Last Name</StyledTableCellHead>
              <StyledTableCellHead align="right">First Name</StyledTableCellHead>
              <StyledTableCellHead align="right">Address</StyledTableCellHead>
              <StyledTableCellHead align="right">Threatment Request</StyledTableCellHead>
              <StyledTableCellHead align="right">Actions</StyledTableCellHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.filter(patient => patient.birthId.includes(searchTerm)).map((patient, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <StyledTableCellBody component="th" scope="row">
                  {patient.birthId}
                </StyledTableCellBody>
                <StyledTableCellBody align="right">{patient.lastName}</StyledTableCellBody>
                <StyledTableCellBody align="right">{patient.firstName}</StyledTableCellBody>
                <StyledTableCellBody align="right">{patient.address}</StyledTableCellBody>
                <StyledTableCellBody align="right"> <AddCircleIcon onClick={() => handleOpenModal(patient)} style={{ cursor: 'pointer' }} /> {/* New Icon for adding request */}</StyledTableCellBody>
                <StyledTableCellBody align="right">
                  <DeleteIcon onClick={() => handleDelete(patient.birthId)} style={{ cursor: 'pointer' }}/>
                  <EditIcon style={{ cursor: 'pointer' }} onClick={() => navigateDetail(patient.birthId)}/>   {/* Add onClick handler for editing */}
                </StyledTableCellBody>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <RequestModal open={modalOpen} handleClose={handleCloseModal} patient={selectedPatient} />
    </div>
  )
}

export default ListPatient