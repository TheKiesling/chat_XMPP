import { useContext } from 'react';
import SessionContext from '../context/SessionContext';

function useLogout() {
    const { logout, success, error, loading } = useContext(SessionContext);
    
    return { logout, success, error, loading };
}

export default useLogout;