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

    // Logout when the user closes the tab
    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Login when username, password and xmppClient are set
    useEffect(() => {
        if (username && password && !xmppClient) {
            login({ username, password });
        } else {
            setLoading(false);
        }
    }, [username, password, xmppClient]);

    // Logout when the user closes the tab
    const handleBeforeUnload = async () => {
        if (xmppClient) {
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
        }); // Create a new XMPP client

        xmpp.on('error', (err) => {
            console.error('Error:', err);
            setError(err);
            setLoading(false);
        });

        // When the client is online, set the username and password and send a presence stanza
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

        // When the client is offline, logout
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
        if (xmppClient) { // If the client is connected, send an unavailable presence stanza and stop the client
            await xmppClient.send(xml('presence', { type: 'unavailable' }));
            await xmppClient.stop();
            xmppClient.removeAllListeners(); 
        }
    
        // Reset the state and remove the username, resource, password, status and messageStatus from the local storage
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

    // Delete the user from the server
    const deleteUser = async () => {
        if (xmppClient) {
            try {
                const iq = xml(
                    'iq',
                    { type: 'set' },
                    xml(
                        'query',
                        { xmlns: 'jabber:iq:register' },
                        xml('remove')
                    )
                );
    
                await xmppClient.send(iq);
                console.log('User deleted from server');
    
                await logout();
            } catch (err) {
                console.error('Error deleting user:', err);
                setError(err);
            }
        }
    };

    // Update the status
    const updateStatus = (newStatus) => {
        setStatus(newStatus);
        localStorage.setItem('status', newStatus);
    };

    // Update the message status
    const updateMessageStatus = (newMessageStatus) => {
        setMessageStatus(newMessageStatus);
        localStorage.setItem('messageStatus', newMessageStatus);
    };

    // Send the presence stanza when the status changes
    useEffect(() => {
        if (status && xmppClient) {
            xmppClient.send(xml('presence', { type: status }));
        }
        if (status === 'available' && xmppClient) {
            xmppClient.send(xml('presence', { type: 'available' }, xml('status', {}, messageStatus)));
        }
    } , [status, xmppClient]);

    // Send the presence stanza when the message status changes
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
        deleteUser,
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
