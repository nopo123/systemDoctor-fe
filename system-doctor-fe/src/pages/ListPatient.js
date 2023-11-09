import React from 'react'
import Button from '@mui/material/Button'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import PrivateKeyDialog from '../components/PrivateKeyDialog'
import useAuth from '../hooks/useAuth'

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
    </div>
  )
}

export default ListPatient