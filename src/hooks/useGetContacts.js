import { useState, useEffect, useContext } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useGetContacts = () => {
    const { xmppClient, username } = useContext(SessionContext);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!xmppClient) {
            return;
        }

        // Roster handling => Get the contacts
        const handleRoster = (stanza) => {
            if (stanza.is('iq') && stanza.attrs.type === 'result') {
                const query = stanza.getChild('query', 'jabber:iq:roster');
                if (query) {
                    const items = query.getChildren('item'); // Get the roster items (contacts)
                    setContacts(prevContacts => {
                        // Create a map of contacts for easier processing
                        const contactMap = new Map(prevContacts.map(contact => [contact.contacto, contact]));
        
                        // Update the map with the new contacts
                        items.forEach(item => {
                            const jid = item.attrs.jid.split('@')[0];
                            const existingContact = contactMap.get(jid);
                            if (existingContact) {
                                existingContact.contacto = jid;
                            } else {
                                contactMap.set(jid, {
                                    contacto: jid,
                                    estado: item.attrs.type || 'unavailable',
                                    messageStatus: item.getChildText('status') || '',
                                });
                            }
                        });
        
                        // Return the updated contacts array
                        return Array.from(contactMap.values());
                    });
                    setLoading(false);
                }
            }
        };
        
        // Presence handling => Update the contacts with their presence status
        const handlePresence = (stanza) => {
            if (stanza.is('presence')) {
                // Extract the contact's JID, username, presence status, and message status
                const fromFullJid = stanza.attrs.from;
                const fromBareJid = fromFullJid.split('/')[0];
                const fromUser = fromBareJid.split('@')[0];
                const estado = stanza.attrs.type || 'available'; 
                const messageStatus = stanza.getChildText('status') || '';
        
                // Update the contact's presence status
                if (estado === 'unsubscribed') {
                    setContacts(prevContacts => prevContacts.filter(contact => contact.contacto !== fromUser));
                } else {
                    // Update the contact's presence status
                    setContacts(prevContacts => {
                        const existingContactIndex = prevContacts.findIndex(contact => contact.contacto === fromUser);
                        if (existingContactIndex > -1) {
                            // Update the existing contact
                            const updatedContacts = [...prevContacts];
                            updatedContacts[existingContactIndex] = { ...updatedContacts[existingContactIndex], estado, messageStatus };
                            return updatedContacts;
                        } else {
                            // Add the new contact if it's subscribed, available, or unavailable
                            if (estado === 'subscribed' || estado === 'available' || estado === 'unavailable') {
                                return [...prevContacts, { contacto: fromUser, estado, messageStatus }];
                            }
                            return prevContacts;
                        }
                    });

                }
            }
        };        


        xmppClient.on('stanza', handleRoster);
        xmppClient.on('stanza', handlePresence);

        const fetchContacts = async () => {
            // The id attribute is used to match the response with the request
            // The query element is used to request the roster
            // The xmlns attribute indicates that we want to get the roster
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
