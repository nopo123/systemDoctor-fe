import React from 'react'
import useAuth from '../hooks/useAuth'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import TextField from '@mui/material/TextField'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Register.module.css'
import Button from '@mui/material/Button'

const Login = () => {
  const { login } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required')
  })

  const initialValues = {
    email: '',
    password: ''
  }

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await login(values)
      resetForm()
      enqueueSnackbar('success', { variant: 'success' })
      navigate('/dashboard')
    } catch (e) {
      enqueueSnackbar('Unauthorized', { variant: 'error' })
    }
    setSubmitting(false)
  }

  return (
    <div className={styles.registerWrapper}>
      <h1 className={styles.nonActive} onClick={() => navigate('/register')}>
        Register
      </h1>
      <h1 className={styles.active}>Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          errors,
          touched,
          values,
          handleChange,
          handleBlur,
          isSubmitting
        }) => (
          <Form>
            <div className={styles.input}>
              <TextField
                fullWidth
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                label={'Email Address'}
                margin='normal'
                name='email'
                autoComplete='off'
                onBlur={handleBlur}
                onChange={handleChange}
                type='email'
                value={values.email}
                variant='standard'
                required
                InputProps={{
                  style: { color: 'black' }
                }}
                InputLabelProps={{
                  style: { color: 'black' }
                }}
              />
            </div>
            <div className={styles.input}>
              <TextField
                fullWidth
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                label={'Password'}
                margin='normal'
                name='password'
                autoComplete='off'
                onBlur={handleBlur}
                onChange={handleChange}
                type='password'
                value={values.password}
                variant='standard'
                required
                InputProps={{
                  style: { color: 'black' }
                }}
                InputLabelProps={{
                  style: { color: 'black' }
                }}
              />
            </div>
            <Button type='submit' className={styles.button} fullWidth>
              {isSubmitting ? 'Loading...' : 'Login'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Login
