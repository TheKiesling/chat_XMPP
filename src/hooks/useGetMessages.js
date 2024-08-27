import { useEffect, useState, useContext } from 'react';
import { SessionContext } from '../context/SessionContext';
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
                    let contact;
                    let sender;
                    let newMessage;

                    if (stanza.attrs.type === "groupchat") {
                        contact = from.split('/')[0].split('@')[0]; 
                        sender = from.split('/')[1];
                        // Evitar duplicar el prefijo del sender en el caso de que sea un mensaje enviado por el usuario
                        newMessage = { sender, content: sender !== username ? `${sender}: ${body}` : body, date };
                    } else {
                        const fromUsername = from.split('/')[0].split('@')[0];
                        const toUsername = to.split('/')[0].split('@')[0];
                        contact = fromUsername === username ? toUsername : fromUsername;
                        sender = fromUsername;
                        newMessage = { sender, content: body, date };
                    }

                    updateConversations(contact, newMessage);
                }
            }

            if (stanza.is('iq') && stanza.getChild('fin', 'urn:xmpp:mam:2')) {
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

        const handlePresence = (stanza) => {
            if (stanza.is('presence')) {
                const fromJid = stanza.attrs.from.split('/')[0].split('@')[0];
                const estado = stanza.attrs.type;
                const messageStatus = stanza.getChildText('status') || '';

                setConversations(prevConversations => {
                    const conversationExists = prevConversations.some(conv => conv.contacto === fromJid);

                    if (conversationExists) {
                        return prevConversations.map(conv => {
                            if (conv.contacto === fromJid) {
                                return { ...conv, estado, messageStatus };
                            }
                            return conv;
                        });
                    } else {
                        return [...prevConversations, { contacto: fromJid, estado, messageStatus, messages: [] }];
                    }
                });
            }
        };

        xmppClient.on('stanza', handleStanza);
        xmppClient.on('presence', handlePresence);

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

        return () => {
            xmppClient.off('stanza', handleStanza);
            xmppClient.off('presence', handlePresence);
        }
    }, [xmppClient, username]);

    function updateConversations(contact, newMessage) {
        setConversations(prevConversations => {
            const conversationExists = prevConversations.some(conv => conv.contacto === contact);

            if (conversationExists) {
                return prevConversations.map(conv => {
                    if (conv.contacto === contact) {
                        return {
                            ...conv,
                            messages: [...conv.messages, newMessage],
                        };
                    }
                    return conv;
                });
            } else {
                return [
                    ...prevConversations,
                    {
                        contacto: contact,
                        messages: [newMessage],
                        estado: contact.status,
                        messageStatus: '',
                    },
                ];
            }
        });
    }

    return { conversations, loading, updateConversations };
};

export default useGetMessages;
