import React, {useState} from 'react'
import PropTypes from 'prop-types'
import styles from './Configuration.module.css'
import Button from '../Button/Button'
import Input from '../Input/Input'
import Notification from '../Notifications/Notification'

const Configuration = ({status, messageStatus, notifications, onDelete}) => {
    return (
        <div className={styles.configuration}>
            <div className={styles.userInfo}>
                <div className={styles.status}>
                    <span>Status</span>
                    <select
                        className={styles.select}
                        value={status}
                        onChange={() => {}}
                    >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>
                <div className={styles.message}>
                    <Input 
                        id="message"
                        label="Message"
                        value={messageStatus}
                        onChange={() => {}}
                    />
                </div>
                <Button onClick={onDelete} children="Delete Account" />
            </div>
            <div className={styles.notifications}>
                {
                    notifications.map(notification => (
                        <Notification 
                            key={notification.user} 
                            user={notification.user} 
                            message={notification.message} 
                            onAccept={notification.onAccept} 
                        />
                    ))
                }
            </div>
        </div>
    )
}

Configuration.propTypes = {
    status: PropTypes.string.isRequired,
    messageStatus: PropTypes.string.isRequired,
    notifications: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired
}

Configuration.defaultProps = {
    status: 'available',
    messageStatus: 'No message',
    notifications: [
        {
            user: 'User',
            message: 'Message1',
            onAccept: () => {}
        },
        {
            user: 'User',
            message: 'Message1',
            onAccept: () => {}
        },
        {
            user: 'User',
            message: 'Message1',
            onAccept: () => {}
        },
    ]
}

export default Configuration