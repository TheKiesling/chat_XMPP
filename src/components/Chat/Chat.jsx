import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './Chat.module.css';
import ContactInfo from '../ContactInfo';
import Message from '../Message/Message';
import ChatInput from '../ChatInput/ChatInput';

const Chat = ({ messages, onSendMessage, contact, onSendFile }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [messages]);

    return (
        <div className={styles.container}>
            <div className={styles.contactInfo}>
                <ContactInfo contact={contact} />
            </div>
            <div className={styles.messages}>
                {messages.length === 0 ? (
                    <div className={styles.welcomeMessage}>
                        <h2>Bienvenido al Chat</h2>
                        <p>Empieza una conversación enviando un mensaje.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <Message key={index} message={msg} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput onSendMessage={onSendMessage} onSendFile={onSendFile} />
        </div>
    );
};

Chat.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            sender: PropTypes.string.isRequired,
            body: PropTypes.string.isRequired
        })
    ).isRequired,
    onSendMessage: PropTypes.func.isRequired
};

Chat.defaultProps = {
    messages: []
};

export default Chat;