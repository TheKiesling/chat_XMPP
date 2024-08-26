import { useEffect, useState, useContext } from 'react';
import { SessionContext } from '../context/SessionContext';
import { xml } from '@xmpp/client';

const useGetMessages = () => {
    const { xmppClient, username } = useContext(SessionContext);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Clear the conversations state when the component is unmounted.
    useEffect(() => {
        setConversations([]);
    }, []);

    useEffect(() => {
        if (!xmppClient) return;

        const handleStanza = (stanza) => {
            // If the stanza is a message and it's not a MAM result, then it's a new message.
            if (stanza.is('message') && !stanza.getChild('result', 'urn:xmpp:mam:2')) {

                // Extract the message data.
                const from = stanza.attrs.from;
                const to = stanza.attrs.to;
                const body = stanza.getChildText('body');
                const date = stanza.attrs.date || new Date().toISOString();

                // If the message has a body, then it's a text message.
                if (body) {
                    const fromUsername = from.split('/')[0].split('@')[0];
                    const toUsername = to.split('/')[0].split('@')[0];
                    const contact = fromUsername === username ? toUsername : fromUsername;
                    const newMessage = { sender: fromUsername, content: body, date };

                    updateConversations(contact, newMessage); // Update the conversations state.
                }
            }

            // If the stanza is a MAM result, then it's an archived message.
            if (stanza.is('iq') && stanza.getChild('fin', 'urn:xmpp:mam:2')) { // The fin element indicates the end of the MAM result.
                setLoading(false);
            } else if (stanza.is('message') && stanza.getChild('result', 'urn:xmpp:mam:2')) { // The result element indicates a MAM message.
                // Extract the archived message data.
                const forwarded = stanza.getChild('result', 'urn:xmpp:mam:2').getChild('forwarded', 'urn:xmpp:forward:0'); // The forwarded element contains the archived message.
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

                    updateConversations(contact, archivedMessage); // Update the conversations state.
                }
            }
        };

        // Handle the presence stanza to update the contact's status.
        const handlePresence = (stanza) => {
            if (stanza.is('presence')) {
                // Extract the presence data.
                const fromJid = stanza.attrs.from.split('/')[0].split('@')[0];
                const estado = stanza.attrs.type;
                const messageStatus = stanza.getChildText('status') || '';

                // Update the contact's status in the conversations state.
                setConversations(prevConversations => {
                    const conversationExists = prevConversations.some(conv => conv.contacto === fromJid);

                    if (conversationExists) { // If the contact already exists in the conversations state, update its status.
                        return prevConversations.map(conv => {
                            if (conv.contacto === fromJid) {
                                return { ...conv, estado, messageStatus };
                            }
                            return conv;
                        });
                    } else { // Is a new contact, add it to the conversations state.
                        return [...prevConversations, { contacto: fromJid, estado, messageStatus, messages: [] }];
                    }
                });
            }
        };

        xmppClient.on('stanza', handleStanza);
        xmppClient.on('presence', handlePresence);

        // Fetch archived messages using MAM.
        const fetchArchivedMessages = async () => {
            // The query element indicates that we want to fetch archived messages using MAM.
            // The x element is a data form that indicates the type of query we want to perform.
            // The field element indicates the type of form we want to submit.
            // The value element indicates the value of the field.
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

    // Update the conversations state with the new message sent or received.
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