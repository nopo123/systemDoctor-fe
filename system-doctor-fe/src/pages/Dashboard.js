import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Button from '@mui/material/Button'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Register.module.css'
import keyStyles from '../styles/Key.module.css'
import UserService from '../services/UserService'
import CypherService from '../services/CypherService'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import TextField from '@mui/material/TextField'
import { parseErrorMessage } from '../utils/errorMessage'
import FormGroup from '@mui/material/FormGroup'
import AppService from '../services/AppService'
import PrivateKeyDialog from '../components/PrivateKeyDialog'

const Dashboard = () => {
  const { logout } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [privateKey, setPrivateKey] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [checkedPublic, setCheckedPublic] = useState(true)
  const [checkedPair, setCheckedPair] = useState(false)
  const [open, setOpen] = useState(false)

  const Logout = async () => {
    await logout()
    enqueueSnackbar('Logged out.', { variant: 'success' })
    navigate('/login')
  }

  const navigateHandler = async (url) => {
    navigate(url)
  }

  const publicKeyValidationSchema = Yup.object({
    publicKey: Yup.string().required('Public key is required')
  })

  const onSubmitPublic = async (values, { setSubmitting, resetForm }) => {
    try {
      await UserService.updatePublic({ publicKey: values.publicKey })
      resetForm()
      enqueueSnackbar('Public key submitted', { variant: 'success' })
      enqueueSnackbar('Update your private key related to public key', { variant: 'error' })
      setOpen(true)
    } catch (e) {
      enqueueSnackbar(parseErrorMessage(e), { variant: 'error' })
    }
    setSubmitting(false)
  }

  const onClickGeneratePair = async () => {
    try {
      const keys = await CypherService.generateKeyPair()
      setPrivateKey(keys.privateKey)
      setPublicKey(keys.publicKey)
      enqueueSnackbar('Key pair generated', { variant: 'success' })
      enqueueSnackbar('Your old public key was rewrited', {
        variant: 'success'
      })
      enqueueSnackbar('Update your private key', {
        variant: 'error'
      })
    } catch (e) {
      enqueueSnackbar(parseErrorMessage(e), { variant: 'error' })
    }
  }

  const copyToClipboard = (key, updating) => {
    switch (updating) {
      case 'private':
        navigator.clipboard.writeText(key).then(() => {
          enqueueSnackbar('Private key copied to clipboard', {
            variant: 'success'
          })
          setPrivateKey('')
        })
        AppService.saveKey(key)
        setOpen(true)
        break
      case 'public':
        navigator.clipboard.writeText(key).then(() => {
          enqueueSnackbar('Public key copied to clipboard', {
            variant: 'success'
          })
          setPublicKey('')
        })
        break
      default:
        break
    }
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
      </div>
      <div className={styles.registerWrapper}>
        <h1>Key Management</h1>
        <div>
          <FormControlLabel
            control={<Checkbox />}
            label='Enter my public key'
            checked={checkedPublic}
            onChange={() => setCheckedPublic(!checkedPublic)}
          />
          <FormControlLabel
            control={<Checkbox />}
            label='Generate key pair'
            checked={checkedPair}
            onChange={() => setCheckedPair(!checkedPair)}
          />
        </div>
        {checkedPublic && (
          <div>
            <h2>Public Key Form</h2>
            <Formik
              initialValues={{ publicKey: '' }}
              validationSchema={publicKeyValidationSchema}
              onSubmit={onSubmitPublic}
            >
              {({ errors, touched, handleChange }) => (
                <Form>
                  <div>
                    <FormGroup>
                      <Field
                        name='publicKey'
                        as={TextField}
                        label='Public Key'
                        margin='normal'
                        variant='outlined'
                        error={Boolean(touched.publicKey && errors.publicKey)}
                        helperText={touched.publicKey && errors.publicKey}
                        onChange={handleChange}
                        multiline
                        rows={5}
                        style={{
                          maxWidth: '400px',
                          width: '300px',
                        }}
                      />
                    </FormGroup>
                  </div>
                  <div style={{ marginTop: 5 }}>
                    <Button type='submit' variant='contained' color='primary'>
                      Submit Public Key
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {checkedPair && (
          <div className={keyStyles.optionalKey}>
            <div className={keyStyles.stackedDiv}>
              <Button
                onClick={onClickGeneratePair}
                variant='contained'
                color='secondary'
                style={{ margin: '60px 0' }}
              >
                Generate key pair
              </Button>
            </div>
            <div className={keyStyles.stackedDiv}>
              <TextField
                label='Your Private Key'
                margin='normal'
                variant='outlined'
                value={privateKey}
                multiline
                rows={5}
                style={{
                  maxWidth: '90%',
                  margin: 'auto',
                  width: '100%'
                }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <Button
                      onClick={() => copyToClipboard(privateKey, 'private')}
                    >
                      Copy
                    </Button>
                  )
                }}
              />
            </div>
            <div className={keyStyles.stackedDiv}>
              <TextField
                label='Your Public Key'
                margin='normal'
                variant='outlined'
                value={publicKey}
                multiline
                rows={5}
                style={{
                  maxWidth: '90%',
                  margin: 'auto',
                  width: '100%'
                }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <Button
                      onClick={() => copyToClipboard(publicKey, 'public')}
                    >
                      Copy
                    </Button>
                  )
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
