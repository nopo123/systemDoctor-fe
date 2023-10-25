import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const GuestGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
  } 

  return (
    <>
      {children}
    </>
  );
};

export default GuestGuard;