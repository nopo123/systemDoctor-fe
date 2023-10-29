import React, { useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import TextField from '@mui/material/TextField'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Register.module.css'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { setAtempt, clearOut, setOut } from '../redux/slices/settings'
import AppService from '../services/AppService'

const Login = () => {
  const { login } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { atempt, timeout } = useSelector(state => state.setting)

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required')
  })

  const initialValues = {
    email: '',
    password: ''
  }

  const timeoutHandler = () => {
    setTimeout(() => {
      dispatch(clearOut())
      dispatch(setOut(false))
      AppService.setTimeoutUser(false)
    }, 60000)
  }

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    if (timeout) {
      enqueueSnackbar('Too many login attempts. Please try again later.', {
        variant: 'error'
      })
      return
    }
    try {
      await login(values)
      resetForm()
      enqueueSnackbar('success', { variant: 'success' })
      navigate('/dashboard')
    } catch (e) {
      if (atempt === 2) {
        enqueueSnackbar('Too many login attempts. Please try again later.', {
          variant: 'error'
        })
        dispatch(setOut(true))
        AppService.setTimeoutUser(true)
      } else {
        dispatch(setAtempt())
        enqueueSnackbar('Unauthorized', { variant: 'error' })
      }
    }
    setSubmitting(false)
  }

  useEffect(() => {
    const _timeout = AppService.getTimeoutUser()
    dispatch(setOut(_timeout === 'true' ? true : false))
    if(timeout) timeoutHandler()
  }, [setTimeout, timeout]);

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
