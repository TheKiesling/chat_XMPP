import React from 'react'
import PropTypes from 'prop-types'
import styles from './ContactList.module.css'
import Contact from '../Contact/Contact'

const ContactList = ({ contacts }) => {
    return (
        <div className={styles.contactList}>
            {contacts.map(contact => (
                <Contact key={contact.username} username={contact.username} lastMessage={contact.lastMessage} />
            ))}
        </div>
    )
}

ContactList.propTypes = {}

export default ContactList