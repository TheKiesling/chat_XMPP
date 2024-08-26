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
    const [status, setStatus] = useState(localStorage.getItem('status') || 'offline');
    const [messageStatus, setMessageStatus] = useState(localStorage.getItem('messageStatus') || '');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (username && password && !xmppClient) {
            console.log("Attempting to reconnect with stored credentials");
            login({ username, password });
        } else {
            console.log("Setting loading to false");
            setLoading(false);
        }
    }, [username, password, xmppClient]);

    const handleBeforeUnload = async () => {
        if (xmppClient) {
            console.log("Handling before unload");
            await logout();
        }
    };

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
            setStatus('available');
            setMessageStatus(localStorage.getItem('messageStatus') || '');
            setLoading(false);
        });

        xmpp.on('offline', async () => {
            logout();
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
        if (xmppClient) {
            await xmppClient.send(xml('presence', { type: 'unavailable' }));
            await xmppClient.stop();
            xmppClient.removeAllListeners(); 
        }
    
        setXmppClient(null);
        setUsername(null);
        setPassword(null);
        setStatus('unavailable');
        localStorage.removeItem('username');
        localStorage.removeItem('resource');
        localStorage.removeItem('password');
        localStorage.removeItem('status');
        localStorage.removeItem('messageStatus');
        localStorage.setItem('logout', Date.now());
        setLoading(false);
    };

    const updateStatus = (newStatus) => {
        setStatus(newStatus);
        localStorage.setItem('status', newStatus);
    };

    const updateMessageStatus = (newMessageStatus) => {
        setMessageStatus(newMessageStatus);
        localStorage.setItem('messageStatus', newMessageStatus);
    };

    useEffect(() => {
        if (status && xmppClient) {
            xmppClient.send(xml('presence', { type: status }));
        }
        if (status === 'available' && xmppClient) {
            xmppClient.send(xml('presence', { type: 'available' }, xml('status', {}, messageStatus)));
        }
    } , [status, xmppClient]);

    useEffect(() => {
        if (xmppClient && status) {
            xmppClient.send(xml('presence', {type: status}, xml('status', {}, messageStatus)));
        }
    } , [messageStatus, xmppClient]);

    useEffect(() => {
        localStorage.setItem('status', status);
        localStorage.setItem('messageStatus', messageStatus);
    }, [status, messageStatus]);
    

    const data = {
        xmppClient,
        username,
        password,
        status,
        messageStatus,
        login,
        logout,
        updateStatus,
        updateMessageStatus,
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

export { SessionProvider, SessionContext };
