import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import AuthGuard from './components/AuthGuard';
import GuestGuard from './components/GuestGuard';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreatePatient from './pages/CreatePatient';
import ListPatient from './pages/ListPatient';  
import PatientDetail from './pages/PatientDetail';


const routes = [
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/register',
    element: (
      <GuestGuard>
        <Register />
      </GuestGuard>
    )
  },
  {
    path: '/login',
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    )
  },
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    )
  },
  {
    path: '/create_patient',
    element: (
      <AuthGuard>
        <CreatePatient />
      </AuthGuard>
    )
  },
  {
    path: '/patientsList',
    element: (
      <AuthGuard>
        <ListPatient />
      </AuthGuard>
    )
  },
  {
    path: '/patient/:id', 
    element: (
      <AuthGuard>
        <PatientDetail />
      </AuthGuard>
    )
  },
]

export default routes
