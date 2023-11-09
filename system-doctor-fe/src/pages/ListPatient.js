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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const ListPatient = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)
  const { logout } = useAuth()

  const navigateHandler = async (url) => {
    navigate(url)
  }

  const Logout = async () => {
    await logout()
    enqueueSnackbar('Logged out.', { variant: 'success' })
    navigate('/login')
  }

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
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
              <TableCell align="right"><DeleteIcon /><EditIcon /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default ListPatient