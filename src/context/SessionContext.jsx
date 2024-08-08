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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async ({ username, password }) => {
      setLoading(true);
      const resource = 'login';
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

      xmpp.on('online', async (address) => {
          console.log(`Online as ${address}`);
          setUsername(username);
          localStorage.setItem('username', username);
          localStorage.setItem('resource', resource);
          setLoading(false);
          await xmpp.send(xml('presence'));
      });

      xmpp.on('offline', () => {
          console.log('Offline');
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
          setXmppClient(null);
          setUsername(null);
          localStorage.removeItem('username');
          localStorage.removeItem('resource');
      }
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
  