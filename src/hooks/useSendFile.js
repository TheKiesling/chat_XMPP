import { useContext } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useSendFile = (updateConversations) => {
    const { xmppClient, username } = useContext(SessionContext);

    const sendFile = async (to, file) => {

        // Define the handler for the server response
        const handleStanza = async (stanza) => {
            if (stanza.is("iq") && stanza.attrs.id === 'upload-request') {
                const slot = stanza.getChild('slot', 'urn:xmpp:http:upload:0'); // Extract the slot element from the response
                const putUrl = slot.getChild('put').attrs.url; // Extract the URL to upload the file

                // Upload the file to the server
                await fetch(putUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type
                    }
                });

                // Create the message stanza with the file URL
                const fileMessage = xml(
                    'message',
                    { type: 'chat', to },
                    xml('body', {}, putUrl),
                    xml('request', { xmlns: 'urn:xmpp:receipts' }), // Add the message receipts extension
                    xml('markable', { xmlns: 'urn:xmpp:chat-markers:0' }) // Add the chat markers extension
                );

                // Send the message with the file URL
                await xmppClient.send(fileMessage);
                console.log('Message with file URL sent');

                // Update the conversations state with the message
                if (updateConversations) {
                    updateConversations(to.split('@')[0], {
                        sender: username,
                        content: putUrl,
                        date: new Date().toISOString()
                    });
                }

                xmppClient.off('stanza', handleStanza);
            }
        };

        try {
            xmppClient.off('stanza', handleStanza);

            // Send the request to the server to get the file upload slot
            // The iq stanza is sent to the HTTP File Upload service
            // The HTTP File Upload service is a component that allows uploading files to the XMPP server
            // The request element contains the file metadata
            const requestSlot = xml(
                'iq',
                { type: 'get', to: 'httpfileupload.alumchat.lol', id: 'upload-request' }, // The request is sent to the HTTP File Upload service
                xml('request', { xmlns: 'urn:xmpp:http:upload:0', filename: file.name, size: file.size, 'content-type': file.type })
            );
            await xmppClient.send(requestSlot);

            xmppClient.on('stanza', handleStanza);
        } catch (error) {
            console.error('Failed to send file:', error);
        }
    };

    return { sendFile };
};

export default useSendFile;
