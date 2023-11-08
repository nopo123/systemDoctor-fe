import React, { useEffect } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import AppService from '../services/AppService'
import Button from '@mui/material/Button'
import { useSnackbar } from 'notistack'

const PrivateKeyDialog = props => {
  const { open, setOpen } = props
  const [privateKey, setPrivateKey] = React.useState('')
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = () => {
    setOpen(false)
    setPrivateKey('')
  }

  const handleSave = () => {
    if (
      !privateKey ||
      privateKey.length < 1 ||
      !privateKey.includes('PRIVATE KEY') ||
      !privateKey.includes('BEGIN') ||
      !privateKey.includes('END')
    ) {
      enqueueSnackbar('Wrong format of private key', { variant: 'error' });
      return
    }
    setOpen(false)
    AppService.saveKey(privateKey)
  }

  useEffect(() => {
    const getKey = () => {
      const key = AppService.getKey();
      if (!key) {
        setOpen(true);
        enqueueSnackbar('Private key not found', { variant: 'error' });
      }
    }
    getKey();
  }, []);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Please, enter your private key</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          multiline
          margin='dense'
          id='privateKey'
          label='private key'
          type='text'
          fullWidth
          value={privateKey || ''}
          onChange={e => setPrivateKey(e.target.value)}
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
  )
}

export default PrivateKeyDialog
