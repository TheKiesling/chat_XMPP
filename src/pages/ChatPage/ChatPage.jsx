import React, { useContext, useState, useEffect } from 'react';
import SessionContext from '../../context/SessionContext';
import styles from './ChatPage.module.css';
import Header from '../../components/Header';
import Chat from '../../components/Chat';
import ContactList from '../../components/ContactList';
import useGetMessages from '../../hooks/useGetMessages';
import useSendMessage from '../../hooks/useSendMessage';
import { domain } from '../../config';
import NavBar from '../../components/Navbar';
import UserList from '../../components/UserList';

const ChatPage = () => {
    const { username } = useContext(SessionContext);
    const { conversations, updateConversations } = useGetMessages();
    const [selectedContact, setSelectedContact] = useState(null);
    const { sendMessage } = useSendMessage(updateConversations);
    const [isForumSelected, setIsForumSelected] = useState(true); 
    const [isUserSelected, setIsUserSelected] = useState(false);

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

    const contact = conversations.find(conv => conv.contacto === selectedContact) || null;

    const handleSendMessage = (body) => {
        const to = `${selectedContact}@${domain}`;
        sendMessage(to, body);
    }

    useEffect(() => {
        console.log('userSelected', isUserSelected);
        console.log('forumSelected', isForumSelected);
    }, [isUserSelected, isForumSelected]);

    return (
        <div className={styles.container}>
            <Header username={username} />
            <div className={styles.content}>
                <div className={styles.navBar}>
                    <NavBar onForumSelect={handleForumSelect} onUserSelect={handleUserSelect} />
                </div>
                <div className={styles.contactList}>
                    {isUserSelected && <UserList />}
                    {isForumSelected &&<ContactList contacts={conversations} onSelectContact={handleSelectContact} /> }
                </div>
                <div className={styles.chatContainer}>
                    { contact && <Chat messages={messages} onSendMessage={handleSendMessage} contact={contact} />}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;