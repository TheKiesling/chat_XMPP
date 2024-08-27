import React, {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import styles from './Configuration.module.css'
import Button from '../Button/Button'
import Input from '../Input/Input'
import Notification from '../Notifications/Notification'
import { SessionContext } from '../../context/SessionContext'

const Configuration = ({ notifications }) => {

    const { status, messageStatus, updateStatus, updateMessageStatus, deleteUser } = useContext(SessionContext)

    const [userStatus, setUserStatus] = useState(status)
    const [userMessageStatus, setUserMessageStatus] = useState(messageStatus)


    return (
        <div className={styles.configuration}>
            <div className={styles.userInfo}>
                <div className={styles.status}>
                    <span>Status</span>
                    <select
                        className={styles.select}
                        value={userStatus}
                        onChange={(e) => {
                            setUserStatus(e.target.value)
                            updateStatus(e.target.value)
                        }}
                    >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>
                <div className={styles.message}>
                    <Input 
                        id="message"
                        label="Message"
                        value={userMessageStatus}
                        onChange={(e) => {
                            setUserMessageStatus(e.target.value)
                            updateMessageStatus(e.target.value)
                        }}
                        disabled = {userStatus === 'unavailable'}
                    />
                </div>
                <Button onClick={deleteUser} children="Delete Account" />
            </div>
            <div className={styles.notifications}>
                {
                    notifications.map(notification => (
                        <Notification 
                            key={notification.user} 
                            user={notification.user} 
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