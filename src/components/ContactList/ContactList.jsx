import React from 'react';
import PropTypes from 'prop-types';
import styles from './ContactList.module.css';
import Contact from '../Contact/Contact';

const ContactList = ({ contacts, onSelectContact }) => {
    const compareByDate = (a, b) => {
        if (!a.ultimo_mensaje && !b.ultimo_mensaje) return 0;
        if (!a.ultimo_mensaje) return 1;
        if (!b.ultimo_mensaje) return -1;
        return new Date(b.ultimo_mensaje.date) - new Date(a.ultimo_mensaje.date);
    };

    console.log('Contacts:', contacts);

    const sortedContacts = [...contacts].sort(compareByDate);

    return (
        <div className={styles.contactList}>
            {sortedContacts.length === 0 ? (
                <div className={styles.noContacts}>
                    <p>No contacts available. Add some friends!</p>
                </div>
            ) : (
                sortedContacts.map(contact => (
                    <Contact
                        key={contact.contacto}
                        username={{ name: contact.contacto, state: contact.estado }}
                        lastMessage={contact.ultimo_mensaje}
                        onClick={() => onSelectContact(contact.contacto)}
                        unread={contact.unread}
                    />
                ))
            )}
        </div>
    );
};

ContactList.propTypes = {
    contacts: PropTypes.arrayOf(
        PropTypes.shape({
            contacto: PropTypes.string.isRequired,
            estado: PropTypes.string,
            ultimo_mensaje: PropTypes.shape({
                from: PropTypes.string,
                content: PropTypes.string,
                date: PropTypes.string,
            }),
        })
    ).isRequired,
    onSelectContact: PropTypes.func.isRequired,
};

ContactList.defaultProps = {
    contacts: []
};

export default ContactList;