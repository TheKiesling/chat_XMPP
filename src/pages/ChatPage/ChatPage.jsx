import React, { useContext, useState, useEffect } from 'react';
import { SessionContext } from '../../context/SessionContext';
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
import Configuration from '../../components/Configuration';
import useSendFile from '../../hooks/useSendFile';
import useGetContactRequest from '../../hooks/useGetContactRequest';
import useGetGroups from '../../hooks/useGetGroups';
import GroupList from '../../components/GroupList';
import useJoinGroup from '../../hooks/useJoinGroup';

const ChatPage = () => {
    const { username } = useContext(SessionContext);

    const { conversations, updateConversations, getGroupMessages } = useGetMessages();
    const [selectedContact, setSelectedContact] = useState(null);
    const { sendMessage } = useSendMessage(updateConversations);
    const { sendFile } = useSendFile(updateConversations);
    const { contactRequests } = useGetContactRequest();
    const { groups } = useGetGroups();
    const { joinGroupChat } = useJoinGroup();

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (contactRequests.length > 0) {
            setNotifications(contactRequests.map(request => ({
                user: request.jid,
                onAccept: () => {
                    console.log('Accepting contact request from', request.jid);
                }
            })));
        }
    }, [contactRequests]);

    const [isForumSelected, setIsForumSelected] = useState(true); 
    const [isUserSelected, setIsUserSelected] = useState(false);
    const [isConfigurationSelected, setIsConfigurationSelected] = useState(false);
    const [isGroupSelected, setIsGroupSelected] = useState(false);
    const [messageToGroup, setMessageToGroup] = useState(false);

    const { contacts } = useGetContacts();
    const { users } = useGetUsers();

    // Filter out the users that are not in the contacts list
    const usersWithoutContacts = users.filter(user => !contacts.find(contact => contact.contacto === user.jid.split('@')[0]));

    // Combine the contacts and users lists
    const contactsList = contacts.map(contact => { // Add the messages and the last message to the contacts
        const conversation = conversations.find(conv => conv.contacto === contact.contacto);
        return {
            ...contact,
            messages: conversation?.messages || [],
            ultimo_mensaje: conversation?.messages[conversation.messages.length - 1] || null,
        };
    });

    const usersList = usersWithoutContacts.map(user => { // Add the messages and the last message to the users
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

    const groupsList = groups.map(group => {
        const conversation = conversations.find(conv => conv.contacto === group.jid);
        if (conversation?.messages) {
            return {
                contacto: group.jid,
                messages: conversation.messages,
                ultimo_mensaje: conversation.messages[conversation.messages.length - 1] || null,
            };
        }
        return null;
    }).filter(group => group !== null);

    const combinedContacts = [...contactsList, ...usersList, ...groupsList];   

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
        if (groups.find(group => group.jid.split('@')[0] === contact)) {
            setMessageToGroup(true);
        } else {
            setMessageToGroup(false);
        }
    };

    useEffect(() => {
        console.log('Selected contact:', selectedContact);
    }, [selectedContact]);


    const handleSelectGroup = (groupJid) => {
        joinGroupChat(groupJid);
        setSelectedContact(groupJid);
        setMessageToGroup(true);
    };

    useEffect(() => {
        console.log('messageToGroup:', messageToGroup, 'selectedContact:', selectedContact);
    }, [messageToGroup, selectedContact]);

    const handleForumSelect = () => {
        setIsForumSelected(true);
        setIsUserSelected(false);
        setIsConfigurationSelected(false);
        setIsGroupSelected(false);
    };

    const handleUserSelect = () => {
        setIsUserSelected(true);
        setIsForumSelected(false);
        setIsConfigurationSelected(false);
        setIsGroupSelected(false);
    }

    const handleConfigurationSelect = () => {
        setIsConfigurationSelected(true);
        setIsForumSelected(false);
        setIsUserSelected(false);
        setIsGroupSelected(false);
    }

    const handleGroupSelect = () => {
        setIsGroupSelected(true);
        setIsConfigurationSelected(false);
        setIsForumSelected(false);
        setIsUserSelected(false);
    }

    // Get the messages of the selected contact
    const messages = selectedContact
        ? conversations.find(conv => conv.contacto === selectedContact)?.messages || []
        : [];

    // Get the users that are not in the contacts list
    const usersInfo = usersWithoutContacts.map(user => ({
        contacto: user.jid.split('@')[0],
        estado: user.state,
        messageStatus: user.messageStatus,
        messages: user.messages || [],
        ultimo_mensaje: user.ultimo_mensaje || ''
    }));

    const usersAndContacts = [...contactsList, ...usersInfo];

    const contact = usersAndContacts.find(contact => contact.contacto === selectedContact);

    const handleSendMessage = (body) => {
        const to = messageToGroup ? `${selectedContact}@conference.${domain}` : `${selectedContact}@${domain}`;
        sendMessage(to, body);
    }

    const handleSendFile = (file) => {
        const to = messageToGroup ? `${selectedContact}@conference.${domain}` : `${selectedContact}@${domain}`;
        sendFile(to, file);
    }

    return (
        <div className={styles.container}>
            <Header username={username} />
            <div className={styles.content}>
                <div className={styles.navBar}>
                    <Navbar onForumSelect={handleForumSelect} onUserSelect={handleUserSelect} onConfigurationSelect={handleConfigurationSelect} onGroupSelect={handleGroupSelect} />
                </div>
                <div className={styles.contactList}>
                    {isUserSelected && <UserList users={usersWithoutContacts} onSelectContact={handleSelectContact}/>}
                    {isForumSelected &&<ContactList contacts={combinedContacts} onSelectContact={handleSelectContact} /> }
                    {isGroupSelected && <GroupList groups={groups} onSelectGroup={handleSelectGroup} />}
                    {isConfigurationSelected && <Configuration contacts={contactsList} users={usersList} notifications={notifications} />}
                </div>
                <div className={styles.chatContainer}>
                    { contact && <Chat messages={messages} onSendMessage={handleSendMessage} contact={contact} onSendFile={handleSendFile} />}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
