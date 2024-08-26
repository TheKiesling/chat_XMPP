import { useContext } from 'react';
import { SessionContext } from '../context/SessionContext';

function useLogin() {
    const { login, error, loading } = useContext(SessionContext);
    
    return { login, error, loading };
}

export default useLogin;
