import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './ContactInfo.module.css'
import ProfilePhoto from '../ProfilePhoto'

const ContactInfo = ({contact}) => {

    const { contacto, estado } = contact;

    const initial = contacto[0]?.toUpperCase();
    const messageStatus = contact.messageStatus;

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
        contacto: PropTypes.string.isRequired,
        estado: PropTypes.oneOf(['available', 'absent', 'notAvailable', 'busy', 'away']).isRequired,
        messageStatus: PropTypes.string.isRequired,
    }).isRequired,
}


export default ContactInfo