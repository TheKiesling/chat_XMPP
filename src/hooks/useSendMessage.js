import { useContext } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useSendMessage = (updateConversations) => {
    const { xmppClient, username } = useContext(SessionContext);

    const sendMessage = async (to, body) => {
        // Create the message stanza with the message body
        const message = xml(
            'message',
            { type: 'chat', to },
            xml('body', {}, body),
        );

        try {
            // Send the message
            await xmppClient.send(message);

            // Update the conversations state with the message
            if (updateConversations) {
                updateConversations(to.split('@')[0], { sender: username, content: body, date: new Date().toISOString() });
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return { sendMessage };
};

export default useSendMessage;
