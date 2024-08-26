import { useState, useEffect, useContext } from 'react';
import { xml } from '@xmpp/client';
import { SessionContext } from '../context/SessionContext';

const useGetUsers = (filter = '*') => {
    const { xmppClient } = useContext(SessionContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the users that match the filter.
    useEffect(() => {
        if (!xmppClient) {
            return;
        }

        // Handle the response to the search request.
        const handleUsers = (stanza) => {
            if (stanza.is('iq') && stanza.attrs.type === 'result') { // Check if the stanza is an IQ result.
                // Extract the users from the search result.
                const query = stanza.getChild('query', 'jabber:iq:search');
                if (query) { // Check if the stanza contains a search query.
                    // Extract the users from the search result.
                    const x = query.getChild('x', 'jabber:x:data');
                    const items = x.getChildren('item');

                    // Map the users to a more readable format.
                    const usersList = items.map(item => {
                        const fields = item.getChildren('field');
                        let user = {};

                        // Extract the user's JID, name, and email.
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

        // Send the search request to the server.
        const fetchUsers = async () => {
            try {
                // The iq stanza to request the users that match the filter.
                // The search request is sent to the search service.
                // The search service is a component that allows searching for users in the XMPP server.
                const searchRequest = xml(
                    'iq',
                    { type: 'set', id: 'search1', to: 'search.alumchat.lol' },
                    xml('query', { xmlns: 'jabber:iq:search' },
                        xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
                            xml('field', { var: 'FORM_TYPE', type: 'hidden' },
                                xml('value', {}, 'jabber:iq:search')
                            ),
                            xml('field', { var: 'search' },  // The search field with the filter value.
                                xml('value', {}, filter) // The filter value to search for users.
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
