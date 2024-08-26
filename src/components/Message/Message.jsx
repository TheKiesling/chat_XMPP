import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import styles from './Message.module.css'
import { SessionContext } from '../../context/SessionContext';

const Message = ({ message }) => {

    const { username } = useContext(SessionContext);

    const emisorClass = message.sender === username ? styles.me : styles.other;
    const content = message.content;
    return (
        <div className={`${styles.message} ${emisorClass}`}>
            <p>{content}</p>
        </div>
    )
}

Message.propTypes = {
    message: PropTypes.shape({
        sender: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
    }).isRequired
}

export default Message
