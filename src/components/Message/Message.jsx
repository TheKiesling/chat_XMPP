import React from 'react'
import PropTypes from 'prop-types'
import styles from './Message.module.css'

const Message = ({ message }) => {
    const emisorClass = message.sender === 'me' ? styles.me : styles.other;
    const content = message.body;
    return (
        <div className={`${styles.message} ${emisorClass}`}>
            <p>{content}</p>
        </div>
    )
}

Message.propTypes = {
    message: PropTypes.shape({
        sender: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired
    }).isRequired
}

export default Message
