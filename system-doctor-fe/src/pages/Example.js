import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import CypherService from '../services/CypherService'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { fetchData } from '../utils/decrypt'
import { parseErrorMessage } from '../utils/errorMessage'

const Example = () => {
  const { logout } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [privateKey, setPrivateKey] = useState(false)
  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])

  const Logout = async () => {
    await logout()
    enqueueSnackbar('Logged out.', { variant: 'success' })
    navigate('/login')
  }

  const privateKeyHandler = () => {
    if (!privateKey) {
      enqueueSnackbar('Could not decrypt data, missing private key', { variant: 'error' })
      return false;
    }
    return true;
  }

  const handleClose = () => {
    privateKeyHandler();
    setOpen(false);
  }

  const handleSave = async () => {
    if (!privateKeyHandler()) {
      return;
    }
    try {
      const _data = await CypherService.getEncryptedData();
      const parsedData = fetchData(privateKey, _data);
      if (!parsedData) {
        enqueueSnackbar("Missing part in private BEGIN PRIVATE or END PRIVATE", { variant: 'error' })
        return;
      }
      setData(parsedData);
      setOpen(false);
    } catch (e) {
      enqueueSnackbar(parseErrorMessage(e), { variant: 'error' })
    }
  }

  const dashboardHandler = async () => {
    navigate('/dashboard')
  }

  useEffect(() => {
    const fetchEncryptedData = async () => {
      if (!privateKey) {
        setOpen(true);
      }
    }
    fetchEncryptedData();
  }, [])

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
          onClick={dashboardHandler}
          variant='outlined'
          color='error'
          size='large'
          style={{ margin: 5 }}
        >
          Dashboard
        </Button>
      </div>
      <div>
        {data.length > 0 && data.map((item, index) => (
          <div key={index} style={{ margin: 5 }}>
            <h3>Krstné meno: {item.firstName}</h3>
            <p>Priezvisko: {item.lastName}</p>
            <p>Text: {item.text ? item.text : 'Ziadny text'}</p>
          </div>
        ))}
      </div>

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Please, enter your private key to decrypt data</DialogTitle>
        <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              id='privateKey'
              label='private key'
              type='text'
              fullWidth
              value={privateKey || ''}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='error'>
            Cancel
          </Button>
          <Button onClick={handleSave} color='success'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Example