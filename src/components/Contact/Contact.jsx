import React from 'react'
import PropTypes from 'prop-types'
import styles from './Contact.module.css'
import ProfilePhoto from '../ProfilePhoto'

const Contact = ({ username, lastMessage }) => {
    const usernameState = username.state
    const usernameInitial = username.name[0]
    const emisor = lastMessage && lastMessage.from === username.name ? 'Me: ' : ''
    const message = lastMessage ? lastMessage.content : ''
    const messageDate = lastMessage ? lastMessage.date : ''

    return (
        <div className={styles.contact}>
            <ProfilePhoto initial={usernameInitial} state={usernameState} />
            <div className={styles.info}>
                <div className={styles.topRow}>
                    <div className={styles.username}>{username.name}</div>
                    <div className={styles.date}>{messageDate}</div>
                </div>
                <div className={styles.lastMessage}>
                    <span className={styles.emisor}>{emisor}</span>
                    <span className={styles.message}>{message}</span>
                </div>
            </div>
        </div>
    )
}

Contact.propTypes = {
    username: PropTypes.shape({
        name: PropTypes.string.isRequired,
        state: PropTypes.oneOf(['available', 'absent', 'notAvailable', 'busy', 'away']).isRequired,
    }),
    lastMessage: PropTypes.shape({
        from: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
    }),
}

Contact.defaultProps = {
    username: {
        name: 'John Doe',
        state: 'available',
    },
    lastMessage: null
}

export default Contact
