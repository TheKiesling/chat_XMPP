import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styles from './Chat.module.css'
import Message from '../Message/Message'
import ChatInput from '../ChatInput/ChatInput'

const Chat = ({ messages }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [messages]);

    return (
        <div className={styles.container}>
            <div className={styles.messages}>
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput />
        </div>
    )
}

Chat.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            sender: PropTypes.string.isRequired,
            body: PropTypes.string.isRequired
        })
    ).isRequired
}

export default Chat