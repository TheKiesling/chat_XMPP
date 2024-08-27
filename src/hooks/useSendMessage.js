import { useContext } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useSendMessage = (updateConversations) => {
    const { xmppClient, username } = useContext(SessionContext);

    const sendMessage = async (to, body) => {
        // Determine if the message is for a group based on the JID
        const isGroupMessage = to.includes('@conference.');

        // Create the message stanza with the appropriate type
        const message = xml(
            'message',
            { type: isGroupMessage ? 'groupchat' : 'chat', to },
            xml('body', {}, body),
        );

        try {
            // Send the message
            await xmppClient.send(message);

            // Update the conversations state with the message
            if (updateConversations && !isGroupMessage) {
                const contact = to.split('@')[0];
                updateConversations(contact, { sender: username, content: body, date: new Date().toISOString() });
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return { sendMessage };
};

export default useSendMessage;
