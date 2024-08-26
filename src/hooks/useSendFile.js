import { useContext } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useSendFile = (updateConversations) => {
    const { xmppClient, username } = useContext(SessionContext);

    const sendFile = async (to, file) => {
        // Definir el manejador de 'stanza' antes de su uso
        const handleStanza = async (stanza) => {
            if (stanza.is("iq") && stanza.attrs.id === 'upload-request') {
                const slot = stanza.getChild('slot', 'urn:xmpp:http:upload:0');
                const putUrl = slot.getChild('put').attrs.url;

                // Subir el archivo al slot recibido
                await fetch(putUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type
                    }
                });

                // Crear mensaje con el enlace del archivo en el contenido (body)
                const fileMessage = xml(
                    'message',
                    { type: 'chat', to },
                    xml('body', {}, putUrl),
                    xml('request', { xmlns: 'urn:xmpp:receipts' }),
                    xml('markable', { xmlns: 'urn:xmpp:chat-markers:0' })
                );

                // Enviar el mensaje con el enlace del archivo
                await xmppClient.send(fileMessage);
                console.log('Message with file URL sent');

                if (updateConversations) {
                    updateConversations(to.split('@')[0], {
                        sender: username,
                        content: putUrl,
                        date: new Date().toISOString()
                    });
                }

                // Remover el manejador de 'stanza' una vez procesado
                xmppClient.off('stanza', handleStanza);
            }
        };

        try {
            // Remover manejador de 'stanza' anterior si existe
            xmppClient.off('stanza', handleStanza);

            // Enviar la solicitud del slot
            const requestSlot = xml(
                'iq',
                { type: 'get', to: 'httpfileupload.alumchat.lol', id: 'upload-request' },
                xml('request', { xmlns: 'urn:xmpp:http:upload:0', filename: file.name, size: file.size, 'content-type': file.type })
            );
            await xmppClient.send(requestSlot);

            // Registrar el manejador para la respuesta del servidor
            xmppClient.on('stanza', handleStanza);
        } catch (error) {
            console.error('Failed to send file:', error);
        }
    };

    return { sendFile };
};

export default useSendFile;
