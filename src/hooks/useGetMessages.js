import { useEffect, useState, useContext, useCallback } from 'react';
import { SessionContext } from '../context/SessionContext';
import { xml } from '@xmpp/client';

const useGetMessages = () => {
    const { xmppClient, username } = useContext(SessionContext);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!xmppClient || !username) return;

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
                        newMessage = { sender, content: sender !== username ? `${sender}: ${body}` : body, date, read: false };
                    } else {
                        const fromUsername = from.split('/')[0].split('@')[0];
                        const toUsername = to.split('/')[0].split('@')[0];
                        contact = fromUsername === username ? toUsername : fromUsername;
                        sender = fromUsername;
                        newMessage = { sender, content: body, date, read: false };
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
                    const archivedMessage = { sender: fromUsername, content: body, date, read: true };

                    updateConversations(contact, archivedMessage);
                }
            }
        };

        const handlePresence = (stanza) => {
            if (stanza.is('presence')) {
                const fromJid = stanza.attrs.from.split('/')[0].split('@')[0];
                const estado = stanza.attrs.type || 'available';
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
                        return [...prevConversations, { contacto: fromJid, estado, messageStatus, messages: [], unreadCount: 0 }];
                    }
                });
            }
        };

        xmppClient.on('stanza', handleStanza);
        xmppClient.on('presence', handlePresence);

        const fetchArchivedMessages = async () => {
            const mamRequest = xml(
                'iq',
                { type: 'set', id: `mam-${Date.now()}` },
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
        };
    }, [xmppClient, username]);

    const updateConversations = useCallback((contact, newMessage) => {
        setConversations(prevConversations => {
            const conversationExists = prevConversations.some(conv => conv.contacto === contact);

            if (conversationExists) {
                return prevConversations.map(conv => {
                    if (conv.contacto === contact) {
                        const updatedMessages = [...conv.messages, newMessage];
                        const unreadCount = newMessage.read ? conv.unreadCount : conv.unreadCount + 1;

                        return {
                            ...conv,
                            messages: updatedMessages,
                            unreadCount,
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
                        estado: 'available',
                        messageStatus: '',
                        unreadCount: newMessage.read ? 0 : 1,
                    },
                ];
            }
        });
    }, []);

    const resetUnreadCount = (contact) => {
        console.log('contact:', contact);
        setConversations(prevConversations =>
            prevConversations.map(conv => {
                if (conv.contacto === contact) {
                    return {
                        ...conv,
                        unreadCount: 0,
                    };
                }
                return conv;
            })
        );
        console.log('conversation reset:', conversations);
    };


    return { conversations, loading, updateConversations, resetUnreadCount };
};

export default useGetMessages;
