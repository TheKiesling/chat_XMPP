import { useContext } from 'react';
import SessionContext from '../context/SessionContext';

function useLogin() {
  const { login, loading, error, username } = useContext(SessionContext);

  return {
    login,
    loading,
    error,
    success: !!username,
  };
}

export default useLogin;
