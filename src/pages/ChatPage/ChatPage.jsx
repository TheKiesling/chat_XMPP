import React, { useContext } from 'react'
import SessionContext from '../../context/SessionContext'
import styles from './ChatPage.module.css'
import Header from '../../components/Header'
import Chat from '../../components/Chat'
import ContactList from '../../components/ContactList'

const ChatPage = () => {
    const { username } = useContext(SessionContext)

    return (
        <div className={styles.container}>
            <Header username={username} />
            <div className={styles.content}>
                <div className={styles.contactList}>
                    <ContactList />
                </div>
                <div className={styles.chatContainer}>
                    <Chat username={username} />
                </div>
            </div>
        </div>
    )
}

export default ChatPage