import { useState, useEffect, useContext } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useGetContactRequest = () => {
    const { xmppClient, username } = useContext(SessionContext);
    const [contactRequests, setContactRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!xmppClient) {
            return;
        }

        const handleRoster = (stanza) => {
            if (stanza.is('iq') && stanza.attrs.type === 'result') {
                const query = stanza.getChild('query', 'jabber:iq:roster');
                if (query) {
                    const items = query.getChildren('item');
                    
                    // Imprime todos los contactos para inspeccionar sus atributos
                    console.log("Todos los contactos en el roster:", items.map(item => ({
                        jid: item.attrs.jid,
                        name: item.attrs.name || item.attrs.jid,
                        subscription: item.attrs.subscription,
                        ask: item.attrs.ask,
                    })));

                    // Filtra los contactos con suscripción "from" y ask="subscribe"
                    const requests = items.filter(item => 
                        item.attrs.subscription === 'to' && item.attrs.ask === 'subscribe'
                    );
                    setContactRequests(requests.map(item => ({
                        jid: item.attrs.jid,
                        name: item.attrs.name || item.attrs.jid,
                        subscription: item.attrs.subscription
                    })));
                    setLoading(false);
                }
            }
        };

        const fetchContactRequests = async () => {
            try {
                xmppClient.on('stanza', handleRoster);

                const rosterRequest = xml(
                    'iq',
                    { type: 'get', id: 'roster' },
                    xml('query', { xmlns: 'jabber:iq:roster' })
                );
                await xmppClient.send(rosterRequest);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchContactRequests();

        return () => {
            xmppClient.off('stanza', handleRoster);
        };
    }, [xmppClient, username]);

    return { contactRequests, loading, error };

};

export default useGetContactRequest;