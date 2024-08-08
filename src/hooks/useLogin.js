import { useContext } from 'react';
import SessionContext from '../context/SessionContext';

function useLogin() {
    const { login, success, error, loading } = useContext(SessionContext);

    return { login, success, error, loading };
}

export default useLogin;
