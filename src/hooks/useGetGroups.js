import { useState, useEffect, useContext } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useGetGroups = () => {
    const { xmppClient } = useContext(SessionContext);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!xmppClient) return;

        // Handle the response to the group discovery request.
        const handleGroupDiscovery = (stanza) => {
            if (stanza.is('iq') && stanza.attrs.type === 'result') {
                const query = stanza.getChild('query', 'http://jabber.org/protocol/disco#items');
                if (query) {
                    const items = query.getChildren('item');
                    const groupList = items.map(item => ({
                        jid: item.attrs.jid,
                        name: item.attrs.name || item.attrs.jid.split('@')[0],
                    }));
                    setGroups(groupList);
                    setLoading(false);
                }
            }
        };

        xmppClient.on('stanza', handleGroupDiscovery);

        const fetchGroups = async () => {
            try {
                const mucServiceJid = `conference.${xmppClient.jid.domain}`;
                const discoverQuery = xml(
                    'iq',
                    { type: 'get', to: mucServiceJid, id: 'disco1' },
                    xml('query', { xmlns: 'http://jabber.org/protocol/disco#items' })
                );
                await xmppClient.send(discoverQuery);
            } catch (err) {
                console.error("Error al enviar la solicitud de descubrimiento de grupos:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchGroups();

        return () => {
            xmppClient.off('stanza', handleGroupDiscovery);
        };
    }, [xmppClient]);

    return { groups, loading, error };
};

export default useGetGroups;
