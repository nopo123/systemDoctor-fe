import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Login from '../pages/Login';
import Register from '../pages/Register';

const GuestGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = window.location.pathname;

  if (!isAuthenticated) {
    if (location.includes('/login')) {
      return <Login />
    }else if (location.includes('/register')) {
      return <Register />
    }else {
      return navigate('/login');
    }
  } 

  return (
    <>
      {children}
    </>
  );
};

export default GuestGuard;