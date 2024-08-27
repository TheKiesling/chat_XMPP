import { useContext, useState } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useJoinGroup = () => {
    const { xmppClient, username } = useContext(SessionContext);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const joinGroupChat = async (jid) => {
        const groupJid = `${jid}/${username}`;

        const joinQuery = xml(
            'presence',
            { to: groupJid },
            xml('x', { xmlns: 'http://jabber.org/protocol/muc' })
        );

        try {
            await xmppClient.send(joinQuery);
            setStatus(`Joined group ${groupJid} successfully`);
            console.log(`Joined group ${groupJid} successfully`);
        } catch (err) {
            console.error("Error joining group chat:", err);
            setError(`Error joining group chat: ${err.message}`);
        }
    };

    return { joinGroupChat, status, error };
};

export default useJoinGroup;
