import React from 'react'
import PropTypes from 'prop-types'
import styles from './Notification.module.css'
import Button from '../Button/Button'

const Notification = ({ user, message, onAccept }) => {
    return (
        <div className={styles.notification}>
            <div className={styles.info}>
              <div className={styles.user}>{user}</div>
              <div className={styles.message}>{message}</div>
            </div>
            <Button onClick={onAccept} children="Accept" />
        </div>
    )
}

Notification.propTypes = {
    user: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onAccept: PropTypes.func.isRequired
}

export default Notification