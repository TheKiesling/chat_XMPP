import { useContext } from 'react';
import { xml } from '@xmpp/client';
import SessionContext from '../context/SessionContext';

const useSendContactRequest = () => {
    const { xmppClient } = useContext(SessionContext);

    const sendContactRequest = async (to) => {
        const presence = xml(
            'presence',
            { type: 'subscribe', to }
        );

        try {
            console.log('Sending contact request:', presence.toString());
            await xmppClient.send(presence);
        } catch (error) {
            console.error('Failed to send contact request:', error);
        }
    };

    return { sendContactRequest };
};

export default useSendContactRequest;