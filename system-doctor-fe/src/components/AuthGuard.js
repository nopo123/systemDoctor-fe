import useAuth from '../hooks/useAuth';
import Login from '../pages/Login';

const AuthGuard = props => {
	const auth = useAuth();

	if (!auth.isAuthenticated) {
		return <Login />
	}

  return props.children;
};

export default AuthGuard;
