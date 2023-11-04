import React, { useState } from 'react'
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

const Dashboard = () => {
  const { logout } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [privateKey, setPrivateKey] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [checkedPublic, setCheckedPublic] = useState(true)
  const [checkedPair, setCheckedPair] = useState(false)

  const Logout = async () => {
    await logout()
    enqueueSnackbar('Logged out.', { variant: 'success' })
    navigate('/login')
  }

  const examplePageHandler = async () => {
    navigate('/example')
  }

  const publicKeyValidationSchema = Yup.object({
    publicKey: Yup.string().required('Public Key is required')
  })

  const onSubmitPublic = async (values, { setSubmitting, resetForm }) => {
    try {
      await UserService.updatePublic({ publicKey: values.publicKey })
      resetForm()
      enqueueSnackbar('Public key submitted', { variant: 'success' })
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
      enqueueSnackbar('Your old public key was rewrited', { variant: 'success' })
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
          onClick={examplePageHandler}
          variant='outlined'
          color='error'
          size='large'
          style={{ margin: 5 }}
        >
          Example Page
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
        {checkedPublic && <div>
          <h2>Public Key Form</h2>
          <Formik
            initialValues={{ publicKey: '' }}
            validationSchema={publicKeyValidationSchema}
            onSubmit={onSubmitPublic}
          >
            {({ errors, touched }) => (
              <Form>
                <Field
                  name='publicKey'
                  as={TextField}
                  fullWidth
                  error={Boolean(touched.publicKey && errors.publicKey)}
                  helperText={touched.publicKey && errors.publicKey}
                  label='Public Key'
                  margin='normal'
                  variant='standard'
                  required
                />
                <Button type='submit' variant='contained' color='primary'>
                  Submit Public Key
                </Button>
              </Form>
            )}
          </Formik>
        </div>}

        {checkedPair && <div className={keyStyles.optionalKey}>
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
                  <Button onClick={() => copyToClipboard(publicKey, 'public')}>
                    Copy
                  </Button>
                )
              }}
            />
          </div>
        </div>}
      </div>
    </div>
  )
}

export default Dashboard
