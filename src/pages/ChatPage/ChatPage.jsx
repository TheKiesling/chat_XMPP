import React, { useContext, useState, useEffect } from 'react';
import SessionContext from '../../context/SessionContext';
import styles from './ChatPage.module.css';
import Header from '../../components/Header';
import Chat from '../../components/Chat';
import ContactList from '../../components/ContactList';
import useGetMessages from '../../hooks/useGetMessages';
import useSendMessage from '../../hooks/useSendMessage';
import { domain } from '../../config';
import Navbar from '../../components/Navbar';
import UserList from '../../components/UserList';
import useGetContacts from '../../hooks/useGetContacts';
import useGetUsers from '../../hooks/useGetUsers';

const ChatPage = () => {
    const { username } = useContext(SessionContext);
    const { conversations, updateConversations } = useGetMessages();
    const [selectedContact, setSelectedContact] = useState(null);
    const { sendMessage } = useSendMessage(updateConversations);
    const [isForumSelected, setIsForumSelected] = useState(true); 
    const [isUserSelected, setIsUserSelected] = useState(false);

    const { contacts } = useGetContacts();
    const { users } = useGetUsers();

    const usersWithoutContacts = users.filter(user => !contacts.find(contact => contact.contacto === user.jid.split('@')[0]));


    const contactsList = contacts.map(contact => {
        const conversation = conversations.find(conv => conv.contacto === contact.contacto);
        return {
            ...contact,
            messages: conversation?.messages || [],
            ultimo_mensaje: conversation?.messages[conversation.messages.length - 1] || null,
        };
    });

    const usersList = usersWithoutContacts.map(user => {
        const conversation = conversations.find(conv => conv.contacto === user.jid.split('@')[0]);
        if (conversation?.messages) {
            return {
                contacto: user.jid.split('@')[0],
                messages: conversation.messages,
                ultimo_mensaje: conversation.messages[conversation.messages.length - 1] || null,
            };
        }
        return null;
    }).filter(user => user !== null);

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
    };

    const handleForumSelect = () => {
        setIsForumSelected(true);
        setIsUserSelected(false);
    };

    const handleUserSelect = () => {
        setIsUserSelected(true);
        setIsForumSelected(false);
    }

    const messages = selectedContact
        ? conversations.find(conv => conv.contacto === selectedContact)?.messages || []
        : [];

    const combinedContacts = [...contactsList, ...usersList];   

    const usersInfo = usersWithoutContacts.map(user => ({
        contacto: user.jid.split('@')[0],
        estado: user.state || 'unavailable',
        messageStatus: user.messageStatus,
        messages: user.messages || [],
        ultimo_mensaje: user.ultimo_mensaje || ''
    }));


    const usersAndContacts = [...contactsList, ...usersInfo];

    const contact = usersAndContacts.find(contact => contact.contacto === selectedContact);

    const handleSendMessage = (body) => {
        const to = `${selectedContact}@${domain}`;
        sendMessage(to, body);
    }

    return (
        <div className={styles.container}>
            <Header username={username} />
            <div className={styles.content}>
                <div className={styles.navBar}>
                    <Navbar onForumSelect={handleForumSelect} onUserSelect={handleUserSelect} />
                </div>
                <div className={styles.contactList}>
                    {isUserSelected && <UserList users={usersWithoutContacts} onSelectContact={handleSelectContact}/>}
                    {isForumSelected &&<ContactList contacts={combinedContacts} onSelectContact={handleSelectContact} /> }
                </div>
                <div className={styles.chatContainer}>
                    { contact && <Chat messages={messages} onSendMessage={handleSendMessage} contact={contact} />}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;