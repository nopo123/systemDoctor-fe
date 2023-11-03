import React, { useState } from 'react';
import useAuth from '../hooks/useAuth'
import Button from '@mui/material/Button'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Register.module.css'
import UserService from '../services/UserService'
import CypherService from '../services/CypherService'

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import { parseErrorMessage } from '../utils/errorMessage'

const Dashboard = () => {
  const { logout } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const Logout = async () => {
    await logout()
    enqueueSnackbar('Logged out.', { variant: 'success' })
    navigate('/login')
  }

  const publicKeyValidationSchema = Yup.object({
    publicKey: Yup.string()
      .required('Public Key is required')
  });

  const onSubmitPublic = async (values, { setSubmitting, resetForm }) => {
    try {
      await UserService.updatePublic({ publicKey: values.publicKey })
      const publicK = await UserService.me();
      console.log(publicK.publicKey)
      resetForm()
      enqueueSnackbar('Public key submitted', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar(parseErrorMessage(e), { variant: 'error' })
    }
    setSubmitting(false)
  }

  const [privateKey, setPrivateKey] = useState('');

  const onClickGeneratePair = async () => {
    try {
      const privateKey = await CypherService.generateKeyPair();
      setPrivateKey(privateKey);
      const publicK = await UserService.me();
      console.log(publicK.publicKey)

      enqueueSnackbar('Key pair generated', { variant: 'success' });
    } catch (e) {
      enqueueSnackbar(parseErrorMessage(e), { variant: 'error' });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(privateKey).then(() => {
      enqueueSnackbar('Private key copied to clipboard', { variant: 'success' });
      setPrivateKey(''); 
      enqueueSnackbar('Failed to copy private key', { variant: 'error' });
    });
  };

  return (
    <div>
      <Button onClick={Logout} variant="outlined" color='error' size='large'>Log out</Button>
      <div className={styles.registerWrapper}>
      <h1>Key Management</h1>

      <div>
        <h2>Public Key Form</h2>
        <Formik
          initialValues={{ publicKey: '' }}
          validationSchema={publicKeyValidationSchema}
          onSubmit={onSubmitPublic}
        >
          {({ errors, touched }) => (
            <Form>
              <Field name="publicKey" as={TextField}
                fullWidth
                error={Boolean(touched.publicKey && errors.publicKey)}
                helperText={touched.publicKey && errors.publicKey}
                label="Public Key"
                margin="normal"
                variant="standard"
                required
              />
              <Button type="submit" variant="contained" color="primary">Submit Public Key</Button>
            </Form>
          )}
        </Formik>
      </div>

      <Button onClick={onClickGeneratePair} variant="contained" color="secondary" style={{ margin: '60px 0' }}>Generate key pair</Button>
      <TextField
        label="Your Private Key"
        margin="normal"
        variant="outlined"
        value={privateKey}
        multiline 
        rows={5} 
        style={{
          width: '50%', 
          margin: 'auto' 
        }}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <Button onClick={copyToClipboard}>Copy</Button>
          ),
        }}
      />
      </div>

    </div>
  )
}

export default Dashboard