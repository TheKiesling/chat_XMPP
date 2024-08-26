import { useState, useEffect, useContext } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useGetContacts = () => {
    const { xmppClient, username, status } = useContext(SessionContext);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!xmppClient) {
            return;
        }

        const handleRoster = (stanza) => {
            if (stanza.is('iq') && stanza.attrs.type === 'result') {
                const query = stanza.getChild('query', 'jabber:iq:roster');
                if (query) {
                    const items = query.getChildren('item');
                    setContacts(prevContacts => {
                        // Crear un mapa de contactos existentes para fácil acceso
                        const contactMap = new Map(prevContacts.map(contact => [contact.contacto, contact]));
        
                        // Procesar cada item del roster
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
        
                        // Convierte el mapa de vuelta a un arreglo para actualizar el estado
                        return Array.from(contactMap.values());
                    });
                    setLoading(false);
                }
            }
        };
        

        const handlePresence = (stanza) => {
            if (stanza.is('presence')) {
                const fromFullJid = stanza.attrs.from;
                const fromBareJid = fromFullJid.split('/')[0];
                const fromUser = fromBareJid.split('@')[0];
                const estado = stanza.attrs.type || 'available'; 
                const messageStatus = stanza.getChildText('status') || '';
        
                // Manejo de contactos no suscritos
                if (estado === 'unsubscribed') {
                    setContacts(prevContacts => prevContacts.filter(contact => contact.contacto !== fromUser));
                } else {
                    // Actualiza o añade el contacto dependiendo si ya existe
                    setContacts(prevContacts => {
                        const existingContactIndex = prevContacts.findIndex(contact => contact.contacto === fromUser);
                        if (existingContactIndex > -1) {
                            // Actualiza contacto existente
                            const updatedContacts = [...prevContacts];
                            updatedContacts[existingContactIndex] = { ...updatedContacts[existingContactIndex], estado, messageStatus };
                            return updatedContacts;
                        } else {
                            // Añade nuevo contacto si es 'subscribed'
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
