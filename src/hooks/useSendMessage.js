import { useContext } from 'react';
import { xml } from '@xmpp/client';
import SessionContext from '../context/SessionContext';

const useSendMessage = (updateConversations) => {
    const { xmppClient, username } = useContext(SessionContext);

    const sendMessage = async (to, body) => {
        const message = xml(
            'message',
            { type: 'chat', to },
            xml('body', {}, body),
        );

        try {
            console.log('Sending message:', message.toString());
            await xmppClient.send(message);
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
