import React from 'react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import TextField from '@mui/material/TextField'
import styles from '../styles/Register.module.css'
import Button from '@mui/material/Button'
import UserService from '../services/UserService'
import { useSnackbar } from 'notistack'
import { parseErrorMessage } from '../utils/errorMessage'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    lastName: Yup.string().required('Required'),
    password: Yup.string()
      .required('Required')
      .matches(
        passwordRegex,
        'Password must contain at least one uppercase letter, ' +
          'one digit, one special character, and be at least 6 characters long.'
      ),
    confirmationPassword: Yup.string()
      .required('Required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
  })

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmationPassword: ''
  }

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await UserService.register(values)
      resetForm()
      enqueueSnackbar('success', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar(parseErrorMessage(e), { variant: 'error' })
    }
    setSubmitting(false)
  }

  return (
    <div className={styles.registerWrapper}>
      <h1 className={styles.nonActive} onClick={() => navigate('/login')}>
        Login
      </h1>
      <h1 className={styles.active}>Register</h1>
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
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                label={'First Name'}
                margin='normal'
                name='firstName'
                autoComplete='off'
                onBlur={handleBlur}
                onChange={handleChange}
                type='text'
                value={values.firstName}
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
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                label={'Last Name'}
                margin='normal'
                name='lastName'
                autoComplete='off'
                onBlur={handleBlur}
                onChange={handleChange}
                type='text'
                value={values.lastName}
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
            <div className={styles.input}>
              <TextField
                fullWidth
                error={Boolean(
                  touched.confirmationPassword && errors.confirmationPassword
                )}
                helperText={
                  touched.confirmationPassword && errors.confirmationPassword
                }
                label={'Confirm Password'}
                margin='normal'
                name='confirmationPassword'
                autoComplete='off'
                onBlur={handleBlur}
                onChange={handleChange}
                type='password'
                value={values.confirmationPassword}
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
              {isSubmitting ? 'Loading...' : 'Register'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Register
