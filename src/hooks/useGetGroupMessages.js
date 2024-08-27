import { useEffect, useState, useContext } from 'react';
import { SessionContext } from '../context/SessionContext';
import { xml } from '@xmpp/client';

const useGetGroupMessages = () => {
    const { xmppClient, username } = useContext(SessionContext);
    const [groupConversations, setGroupConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!xmppClient) return;

        const extractGroupInfo = (from, to) => {
            const fromGroup = from.split('/')[0]; // El grupo será el JID del remitente sin el recurso.
            const fromUser = from.split('/')[1] || '';
            const toUser = to.split('/')[1] || '';
            return { fromGroup, fromUser, toUser };
        };

        const handleStanza = (stanza) => {
            if (stanza.is('message') && stanza.attrs.type === 'groupchat') {
                const { fromGroup, fromUser } = extractGroupInfo(stanza.attrs.from, stanza.attrs.to);
                const body = stanza.getChildText('body');
                const date = stanza.attrs.date || new Date().toISOString();

                if (body) {
                    const newMessage = { sender: fromUser, content: body, date };
                    updateGroupConversations(fromGroup, newMessage);
                }
            }

            if (stanza.is('iq') && stanza.getChild('fin', 'urn:xmpp:mam:2')) {
                setLoading(false);
            } else if (stanza.is('message') && stanza.getChild('result', 'urn:xmpp:mam:2')) {
                const forwarded = stanza.getChild('result', 'urn:xmpp:mam:2').getChild('forwarded', 'urn:xmpp:forward:0');
                if (forwarded) {
                    const message = forwarded.getChild('message');
                    const { fromGroup, fromUser } = extractGroupInfo(message.attrs.from, message.attrs.to);
                    const body = message.getChildText('body');
                    const delay = forwarded.getChild('delay');
                    const date = delay ? delay.attrs.stamp : new Date().toISOString();
                    const archivedMessage = { sender: fromUser, content: body, date };
                    updateGroupConversations(fromGroup, archivedMessage);
                }
            }
        };

        xmppClient.on('stanza', handleStanza);

        const fetchArchivedGroupMessages = async () => {
            const mamRequest = xml(
                'iq',
                { type: 'set', id: 'mam1' },
                xml('query', { xmlns: 'urn:xmpp:mam:2' },
                    xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
                        xml('field', { var: 'FORM_TYPE', type: 'hidden' },
                            xml('value', {}, 'urn:xmpp:mam:2')
                        ),
                        xml('field', { var: 'with' }, // Specify the group JID here if needed
                            xml('value', {}, 'group@conference.server')
                        )
                    )
                )
            );
            await xmppClient.send(mamRequest);
        };

        fetchArchivedGroupMessages();

        return () => {
            xmppClient.off('stanza', handleStanza);
        };
    }, [xmppClient, username]);

    function updateGroupConversations(group, newMessage) {
        setGroupConversations(prevGroupConversations => {
            const groupExists = prevGroupConversations.some(conv => conv.group === group);

            if (groupExists) {
                return prevGroupConversations.map(conv => {
                    if (conv.group === group) {
                        return {
                            ...conv,
                            messages: [...conv.messages, newMessage],
                        };
                    }
                    return conv;
                });
            } else {
                return [
                    ...prevGroupConversations,
                    {
                        group,
                        messages: [newMessage],
                    },
                ];
            }
        });
    }

    return { groupConversations, loading };
};

export default useGetGroupMessages;
