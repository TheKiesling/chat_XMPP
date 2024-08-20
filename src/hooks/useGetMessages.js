import { useEffect, useState, useContext } from 'react';
import SessionContext from '../context/SessionContext';
import { xml } from '@xmpp/client';

const useGetMessages = () => {
    const { xmppClient, username } = useContext(SessionContext);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setConversations([]);
    }, []);

    useEffect(() => {
        if (!xmppClient) return;

        const handleStanza = (stanza) => {
            if (stanza.is('message') && !stanza.getChild('result', 'urn:xmpp:mam:2')) {
                const from = stanza.attrs.from;
                const to = stanza.attrs.to;
                const body = stanza.getChildText('body');
                const date = stanza.attrs.date || new Date().toISOString();
        
                if (body) {
                    const fromUsername = from.split('/')[0].split('@')[0];
                    const toUsername = to.split('/')[0].split('@')[0];
                    const contact = fromUsername === username ? toUsername : fromUsername;
                    const newMessage = { sender: fromUsername, content: body, date };
        
                    updateConversations(contact, newMessage);
                }
            }
        
            if (stanza.is('iq') && stanza.getChild('fin', 'urn:xmpp:mam:2')) {
                console.log('Finished receiving archived messages.');
                setLoading(false);
            } else if (stanza.is('message') && stanza.getChild('result', 'urn:xmpp:mam:2')) {
                const forwarded = stanza.getChild('result', 'urn:xmpp:mam:2').getChild('forwarded', 'urn:xmpp:forward:0');
                if (forwarded) {
                    const message = forwarded.getChild('message');
                    const from = message.attrs.from;
                    const to = message.attrs.to;
                    const body = message.getChildText('body');
                    const delay = forwarded.getChild('delay');
                    const date = delay ? delay.attrs.stamp : new Date().toISOString();
                    const fromUsername = from.split('/')[0].split('@')[0];
                    const toUsername = to.split('/')[0].split('@')[0];
                    const contact = fromUsername === username ? toUsername : fromUsername;
                    const archivedMessage = { sender: fromUsername, content: body, date };
        
                    updateConversations(contact, archivedMessage);
                }
            }
        };
         
        xmppClient.on('stanza', handleStanza);

        const fetchArchivedMessages = async () => {
            const mamRequest = xml(
                'iq',
                { type: 'set', id: 'mam1' },
                xml('query', { xmlns: 'urn:xmpp:mam:2' },
                    xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
                        xml('field', { var: 'FORM_TYPE', type: 'hidden' },
                            xml('value', {}, 'urn:xmpp:mam:2')
                        )
                    )
                )
            );
            await xmppClient.send(mamRequest);
        };

        fetchArchivedMessages();

        return () => xmppClient.off('stanza', handleStanza);
    }, [xmppClient, username]);

    function updateConversations(contact, newMessage) {
        setConversations(prevConversations => {
            const updatedConversations = prevConversations.map(conv => {
                if (conv.contacto === contact) {
                    return {
                        ...conv,
                        messages: [...conv.messages, newMessage],
                        ultimo_mensaje: newMessage,
                    };
                }
                return conv;
            });

            if (!updatedConversations.some(conv => conv.contacto === contact)) {
                updatedConversations.push({
                    contacto: contact,
                    estado: 'available',
                    ultimo_mensaje: newMessage,
                    messages: [newMessage],
                });
            }

            return updatedConversations;
        });
    }

    return { conversations, loading, updateConversations };
};

export default useGetMessages;
