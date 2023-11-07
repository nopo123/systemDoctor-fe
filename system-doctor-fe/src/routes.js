import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Loadable = (Component) => (props) =>
	(
		<Suspense>
			<Component {...props} />
		</Suspense>
	);

const Register = Loadable(lazy(() => import('./pages/Register')));
const Login = Loadable(lazy(() => import('./pages/Login')));
const GuestGuard = Loadable(lazy(() => import('./components/GuestGuard')));
const AuthGuard = Loadable(lazy(() => import('./components/AuthGuard')));
const Dashboard = Loadable(lazy(() => import('./pages/Dashboard')));
const Example = Loadable(lazy(() => import('./pages/Example')));
const CreatePatient = Loadable(lazy(() => import('./pages/CreatePatient')));

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
    path: '/example',
    element: (
      <AuthGuard>
        <Example />
      </AuthGuard>
    )
  },
  {
    path: '/create_patient',
    element: (
        <CreatePatient />
    )
  }
]

export default routes
