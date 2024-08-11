import React from 'react'
import PropTypes from 'prop-types'
import styles from './ContactList.module.css'
import Contact from '../Contact/Contact'

const ContactList = ({ contacts }) => {
    return (
        <div className={styles.contactList}>
            {contacts.length === 0 ? (
                <div className={styles.noContacts}>
                    <p>No contacts available. Add some friends!</p>
                </div>
            ) : (
                contacts.map(contact => (
                    <Contact key={contact.username.name} username={contact.username} lastMessage={contact.lastMessage} />
                ))
            )}
        </div>
    )
}

ContactList.propTypes = {
    contacts: PropTypes.arrayOf(
        PropTypes.shape({
            username: PropTypes.shape({
                name: PropTypes.string.isRequired,
                state: PropTypes.oneOf(['available', 'absent', 'notAvailable', 'busy', 'away']).isRequired,
            }).isRequired,
            lastMessage: PropTypes.shape({
                from: PropTypes.string.isRequired,
                content: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        })
    ).isRequired
}

ContactList.defaultProps = {
    contacts: []
}

export default ContactList