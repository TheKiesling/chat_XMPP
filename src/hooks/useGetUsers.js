import { useState, useEffect, useContext } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useGetUsers = (filter = '*') => {
    const { xmppClient } = useContext(SessionContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!xmppClient) {
            console.error('xmppClient is not initialized');
            setError('XMPP Client not initialized');
            setLoading(false);
            return;
        }

        const handleUsers = (stanza) => {
            if (stanza.is('iq') && stanza.attrs.type === 'result') {
                const query = stanza.getChild('query', 'jabber:iq:search');
                if (query) {
                    const x = query.getChild('x', 'jabber:x:data');
                    const items = x.getChildren('item');

                    const usersList = items.map(item => {
                        const fields = item.getChildren('field');
                        let user = {};

                        fields.forEach(field => {
                            const varAttr = field.attrs.var;
                            const value = field.getChildText('value');
                            user[varAttr] = value;
                        });

                        return {
                            jid: user.jid,
                            name: user.Name,
                            email: user.Email,
                        };
                    });

                    setUsers(usersList);
                    setLoading(false);
                }
            }
        };

        xmppClient.on('stanza', handleUsers);

        const fetchUsers = async () => {
            try {
                const searchRequest = xml(
                    'iq',
                    { type: 'set', id: 'search1', to: 'search.alumchat.lol' },
                    xml('query', { xmlns: 'jabber:iq:search' },
                        xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
                            xml('field', { var: 'FORM_TYPE', type: 'hidden' },
                                xml('value', {}, 'jabber:iq:search')
                            ),
                            xml('field', { var: 'search' }, 
                                xml('value', {}, filter) 
                            ),
                            xml('field', { var: 'Username', type: 'boolean' },
                                xml('value', {}, '1')
                            ),
                            xml('field', { var: 'Name', type: 'boolean' },
                                xml('value', {}, '1')
                            ),
                            xml('field', { var: 'Email', type: 'boolean' },
                                xml('value', {}, '1')
                            )
                        )
                    )
                );

                await xmppClient.send(searchRequest);
            } catch (err) {
                console.error("Error al enviar la solicitud de búsqueda:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();

        return () => {
            xmppClient.off('stanza', handleUsers);
        };
    }, [xmppClient, filter]);

    return { users, loading, error };
};

export default useGetUsers;
