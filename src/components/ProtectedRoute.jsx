import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userName = localStorage.getItem('taskboard_user_name');
  
  if (!userName || userName.trim() === '') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
