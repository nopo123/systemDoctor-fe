import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AuthGuard = props => {
	const auth = useAuth();
  const navigate = useNavigate();

	if (!auth.isAuthenticated) {
		return navigate('/login');
	}

  return props.children;
};

export default AuthGuard;
