import React, {
    createContext, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { client, xml } from '@xmpp/client';
import { service, domain } from '../config';

const SessionContext = createContext();

function SessionProvider({ children }) {
    const [xmppClient, setXmppClient] = useState(null);
    const [username, setUsername] = useState(localStorage.getItem('username') || null);
    const [password, setPassword] = useState(localStorage.getItem('password') || null); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        async function fetchData() {
            if (xmppClient) {
                await xmppClient.stop();
                xmppClient.removeAllListeners();
            }
    
            if (username && password) {
                await login({ username, password });
            }
        }
    
        fetchData();
    }, []); 
    

    const login = async ({ username, password }) => {
        setLoading(true);
        const resource = 'example';
        const xmpp = client({
            service,
            domain,
            resource,
            username,
            password,
        });

        xmpp.on('error', (err) => {
            console.error('Error:', err);
            setError(err);
            setLoading(false);
        });

        xmpp.on('online', async () => {
 
            setUsername(username);
            setPassword(password);
            localStorage.setItem('username', username);
            localStorage.setItem('resource', resource);
            localStorage.setItem('password', password); 
            await xmpp.send(xml('presence'));
            setLoading(false);
        });

        xmpp.on('offline', async () => {
            await xmpp.send(xml('presence', { type: 'unavailable' })); 
            await xmpp.stop();
        });

        try {
            await xmpp.start();
            setXmppClient(xmpp);
        } catch (err) {
            console.error(err);
            setError(err);
            setLoading(false);
        }
    };

    const logout = async () => {
        xmppClient?.on('on', async () => {
            await xmppClient.send(xml('presence', { type: 'unavailable' }));
            await xmppClient.stop();
        });
        setXmppClient(null);
        setUsername(null);
        setPassword(null);
        localStorage.removeItem('username');
        localStorage.removeItem('resource');
        localStorage.removeItem('password');
        localStorage.setItem('logout', Date.now()); 
        setLoading(false);
    };
    
    const data = {
        xmppClient,
        username,
        login,
        logout,
        error,
        loading,
    };

    return (
        <SessionContext.Provider value={data}>
            {children}
        </SessionContext.Provider>
    );
}

SessionProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { SessionProvider };
export default SessionContext;