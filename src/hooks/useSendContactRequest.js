import { useContext } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useSendContactRequest = () => {
    const { xmppClient } = useContext(SessionContext);

    // Send a contact request to the specified JID.
    const sendContactRequest = async (to) => {

        // Create the presence stanza to send the contact request.
        const presence = xml(
            'presence',
            { type: 'subscribe', to } // The type attribute is set to 'subscribe' to send a contact request.
        );

        try {
            await xmppClient.send(presence);
        } catch (error) {
            console.error('Failed to send contact request:', error);
        }
    };

    return { sendContactRequest };
};

export default useSendContactRequest;