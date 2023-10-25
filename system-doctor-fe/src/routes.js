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
  }
]

export default routes
