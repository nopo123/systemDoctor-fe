import React from 'react';
import { useState } from 'react';
import useAuth from '../hooks/useAuth'
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import styles from '../styles/Register.module.css';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import { parseErrorMessage } from '../utils/errorMessage';
import { useNavigate } from 'react-router-dom';


const CreatePatient = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { logout } = useAuth()

  const [allergies, setAllergies] = useState(['']);
  const [diagnosis, setDiagnosis] = useState(['']);


  const handleInputChange = (index, value, state, setState) => {
    const newInputs = [...state];
    newInputs[index] = value;
    setState(newInputs);
  };

  const handleCombineAllergies = () => {
    setAllergies((prevAllergies) => [...prevAllergies, '']);
  };
  const handleCombineDiagnosis = () => {
    setDiagnosis((prevDiagnosis) => [...prevDiagnosis, '']);
  };

  const Logout = async () => {
    await logout()
    enqueueSnackbar('Logged out.', { variant: 'success' })
    navigate('/login')
  }

  const examplePageHandler = async () => {
    navigate('/example')
  }

  const dashboardPageHandler = async () => {
    navigate('/dashboard')
  }

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    birthId: Yup.number()
      .required('Birth ID is required')
      .positive('Birth ID must be a positive number')
      .integer('Birth ID must be an integer')
      .test('len', 'Birth ID must have exactly 10 digits', (value) => value.toString().length === 10),
    residentialCity: Yup.string().required('Residential City is required'),
    street: Yup.string().required('Street is required'),
    diagnosis: Yup.string().notRequired(), 
    allergies: Yup.string().notRequired(), 
  });

  const initialValues = {
    firstName: '',
    lastName: '',
    birthId: '',
    residentialCity: '',
    street: '',
    diagnosis: '', 
    allergies: '',
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      values.allergies = allergies;
      values.diagnosis = diagnosis;
      console.log('Submitted Data:', values);
      resetForm();
      enqueueSnackbar('Success', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(parseErrorMessage(error), { variant: 'error' });
    }
    setSubmitting(false);
  };

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
          onClick={dashboardPageHandler}
          variant='contained'
          color='info'
          size='large'
          style={{ margin: 5 }}
        >
          Dashboard
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
        <h1 className={styles.active}>Create Patient</h1>
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
            isSubmitting,

          }) => (
            <Form>
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
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'black' },
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
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'black' },
                  }}
                />
              </div>
              <div className={styles.input}>
                <TextField
                  fullWidth
                  error={Boolean(touched.birthId && errors.birthId)}
                  helperText={touched.birthId && errors.birthId}
                  label={'Birth ID'}
                  margin='normal'
                  name='birthId'
                  autoComplete='off'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type='text'
                  value={values.birthId}
                  variant='standard'
                  required
                  InputProps={{
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'black' },
                  }}
                />
              </div>
              <div className={styles.input}>
                <TextField
                  fullWidth
                  error={Boolean(touched.residentialCity && errors.residentialCity)}
                  helperText={touched.residentialCity && errors.residentialCity}
                  label={'Residential City'}
                  margin='normal'
                  name='residentialCity'
                  autoComplete='off'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type='text'
                  value={values.residentialCity}
                  variant='standard'
                  required
                  InputProps={{
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'black' },
                  }}
                />
              </div>
              <div className={styles.input}>
                <TextField
                  fullWidth
                  error={Boolean(touched.street && errors.street)}
                  helperText={touched.street && errors.street}
                  label={'Street'}
                  margin='normal'
                  name='street'
                  autoComplete='off'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type='text'
                  value={values.street}
                  variant='standard'
                  required
                  InputProps={{
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'black' },
                  }}
                />
              </div>  
              <div className={styles.input}>
                {allergies.map((allergy, index) => (
                  <div key={index}>
                    <TextField
                      fullWidth
                      label={'Allergy'}
                      margin='normal'
                      name={`allergy-${index}`}
                      autoComplete='off'
                      onChange={(e) => handleInputChange(index, e.target.value, allergies, setAllergies)}
                      type='text'
                      value={allergy}
                      variant='standard'
                      InputProps={{
                        style: { color: 'black' },
                      }}
                      InputLabelProps={{
                        style: { color: 'black' },
                      }}
                    />
                  </div>
                ))}
                <Button onClick={handleCombineAllergies}>Add Allergy</Button>
              </div>
              <div className={styles.input}>
                {diagnosis.map((diagnosisItem, index) => (
                  <div key={index}>
                    <TextField
                      fullWidth
                      label={'Diagnosis'}
                      margin='normal'
                      name={`diagnosis-${index}`}
                      autoComplete='off'
                      onChange={(e) => handleInputChange(index, e.target.value, diagnosis, setDiagnosis)}
                      type='text'
                      value={diagnosisItem}
                      variant='standard'
                      InputProps={{
                        style: { color: 'black' },
                      }}
                      InputLabelProps={{
                        style: { color: 'black' },
                      }}
                    />
                  </div>
                ))}
                <Button onClick={handleCombineDiagnosis}>Add Diagnosis</Button>
              </div>
              
              <Button type='submit' className={styles.button} fullWidth>
                {isSubmitting ? 'Loading...' : 'Create Patient'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreatePatient;
