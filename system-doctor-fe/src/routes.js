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
  }
]

export default routes
