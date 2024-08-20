import React, { useContext, useState, useEffect } from 'react';
import SessionContext from '../../context/SessionContext';
import styles from './ChatPage.module.css';
import Header from '../../components/Header';
import Chat from '../../components/Chat';
import ContactList from '../../components/ContactList';
import useGetMessages from '../../hooks/useGetMessages';
import useSendMessage from '../../hooks/useSendMessage';
import { domain } from '../../config';

const ChatPage = () => {
    const { username } = useContext(SessionContext);
    const { conversations, updateConversations } = useGetMessages();
    const [selectedContact, setSelectedContact] = useState(null);
    const { sendMessage } = useSendMessage(updateConversations);

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
    };

    const messages = selectedContact
        ? conversations.find(conv => conv.contacto === selectedContact)?.messages || []
        : [];

    const contact = conversations.find(conv => conv.contacto === selectedContact) || null;

    const handleSendMessage = (body) => {
        const to = `${selectedContact}@${domain}`;
        sendMessage(to, body);
    }

    return (
        <div className={styles.container}>
            <Header username={username} />
            <div className={styles.content}>
                <div className={styles.contactList}>
                    <ContactList contacts={conversations} onSelectContact={handleSelectContact} />
                </div>
                <div className={styles.chatContainer}>
                    {contact && <Chat messages={messages} onSendMessage={handleSendMessage} contact={contact} />}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;