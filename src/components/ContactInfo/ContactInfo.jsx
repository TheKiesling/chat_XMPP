import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './ContactInfo.module.css'
import ProfilePhoto from '../ProfilePhoto'

const ContactInfo = ({contact}) => {

    const { contacto, estado } = contact;

    const initial = contacto[0]?.toUpperCase();
    const messageStatus = 'Hello, I am using XMPP.';

  return (
    <div className={styles.contactInfo}>
        <ProfilePhoto initial={initial} state={estado} />
        <div className={styles.contact}>
            <div className={styles.name}>{contacto}</div>
            <div className={styles.status}>{messageStatus}</div>
        </div>
    </div>
  )
}

ContactInfo.propTypes = {
    contact: PropTypes.shape({
        name: PropTypes.string.isRequired,
        state: PropTypes.oneOf(['available', 'absent', 'notAvailable', 'busy', 'away']).isRequired,
        messageStatus: PropTypes.string.isRequired,
    }).isRequired,
}

ContactInfo.defaultProps = {
    contact: {
        name: 'John Doe',
        state: 'available',
        messageStatus: 'Hello, I am using XMPP.',
    },
}

export default ContactInfo