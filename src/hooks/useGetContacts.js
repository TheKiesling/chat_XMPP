import { useState, useEffect, useContext } from 'react';
import { xml } from '@xmpp/client';
import SessionContext from '../context/SessionContext';

const useGetContacts = () => {
    const { xmppClient, username } = useContext(SessionContext);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!xmppClient) {
            console.error('xmppClient is not initialized');
            return;
        }

        const handleRoster = (stanza) => {
            if (stanza.is('iq') && stanza.attrs.type === 'result') {
                const query = stanza.getChild('query', 'jabber:iq:roster');
                if (query) {
                    const items = query.getChildren('item');
                    const contactsList = items.map(item => ({
                        contacto: item.attrs.jid.split('@')[0], 
                        estado: '',
                        messageStatus: ''
                    }));
                    setContacts(contactsList);
                    setLoading(false);
                }
            }
        };

        const handlePresence = (stanza) => {
            if (stanza.is('presence')) {
                const fromJid = stanza.attrs.from.split('/')[0].split('@')[0];
                const estado = stanza.attrs.type || 'available';
                const messageStatus = stanza.getChildText('status') || '';

                setContacts(prevContacts => {
                    return prevContacts.map(contact => {
                        if (contact.contacto === fromJid) {
                            return { ...contact, estado, messageStatus };
                        }
                        return contact;
                    });
                });
            }
        };

        xmppClient.on('stanza', handleRoster);
        xmppClient.on('stanza', handlePresence);

        const fetchContacts = async () => {
            const rosterRequest = xml(
                'iq',
                { type: 'get', id: 'roster' },
                xml('query', { xmlns: 'jabber:iq:roster' })
            );
            await xmppClient.send(rosterRequest);
        };

        fetchContacts();

        return () => {
            xmppClient.off('stanza', handleRoster);
            xmppClient.off('stanza', handlePresence);
        };
    }, [xmppClient, username]);

    return { contacts, loading };
};

export default useGetContacts;
