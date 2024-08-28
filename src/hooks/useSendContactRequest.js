import { useContext } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useSendContactRequest = () => {
    const { xmppClient } = useContext(SessionContext);

    // Send a contact request and add the contact to the roster.
    const sendContactRequest = async (to, name = null) => {

        // Create the IQ stanza to add the contact to the roster.
        const rosterIq = xml(
            'iq',
            { type: 'set', id: `roster_${to}` }, // Unique ID for this request
            xml('query', { xmlns: 'jabber:iq:roster' },
                xml('item', { jid: to, name }) // Optionally set a name for the contact
            )
        );

        // Create the presence stanza to send the contact request.
        const presence = xml(
            'presence',
            { type: 'subscribe', to } // The type attribute is set to 'subscribe' to send a contact request.
        );

        try {
            // Send the IQ to add the contact to the roster
            await xmppClient.send(rosterIq);

            // Send the presence to request the subscription
            await xmppClient.send(presence);
        } catch (error) {
            console.error('Failed to send contact request:', error);
        }
    };

    return { sendContactRequest };
};

export default useSendContactRequest;
