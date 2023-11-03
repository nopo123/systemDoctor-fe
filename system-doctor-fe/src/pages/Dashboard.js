import React from 'react'
import useAuth from '../hooks/useAuth'
import Button from '@mui/material/Button'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Register.module.css'
import UserService from '../services/UserService'

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
      // Add any specific validation rules for your public key format here
  });

  const privateKeyValidationSchema = Yup.object({
    privateKey: Yup.string()
      .required('Private Key is required')
      // Add any specific validation rules for your private key format here
  });

  const onSubmitPublic = async (values, { setSubmitting, resetForm }) => {
    try {
      await UserService.updatePublic({ publicKey: values.publicKey });
      const user = await UserService.me()
      console.log(user)
      resetForm()
      enqueueSnackbar('Public key submitted', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar(parseErrorMessage(e), { variant: 'error' })
    }
    setSubmitting(false)
  }

  const onSubmitPrivate = async (values, { setSubmitting, resetForm }) => {
    try {
      //wait login(values)
      resetForm()
      enqueueSnackbar('Private key submitted', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar(parseErrorMessage(e), { variant: 'error' })
    }
    setSubmitting(false)
  }

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

      <div className={styles.formWrapper}>
        <h2>Private Key Form</h2>
        <Formik
          initialValues={{ privateKey: '' }}
          validationSchema={privateKeyValidationSchema}
          onSubmit={onSubmitPrivate}
        >
          {({ errors, touched }) => (
            <Form>
              <Field name="privateKey" as={TextField}
                fullWidth
                error={Boolean(touched.privateKey && errors.privateKey)}
                helperText={touched.privateKey && errors.privateKey}
                label="Private Key"
                margin="normal"
                variant="standard"
                required
              />
              <Button type="submit" variant="contained" color="secondary">Submit Private Key</Button>
            </Form>
          )}
        </Formik>
      </div>
      <Button onClick={Logout} variant="contained" color="info" style={{ marginTop: '60px' }}>Generate key pair</Button>
      </div>

    </div>
  )
}