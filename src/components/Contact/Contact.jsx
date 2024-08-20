import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import styles from './Contact.module.css';
import ProfilePhoto from '../ProfilePhoto';
import SessionContext from '../../context/SessionContext';

const Contact = ({ username, lastMessage, onClick }) => {

    const { username: session } = useContext(SessionContext);

    const usernameState = username.state;
    const usernameInitial = username.name[0].toUpperCase();
    const emisor = lastMessage && lastMessage.sender === session ? <b>me:&nbsp;</b> : '';
    const message = lastMessage ? lastMessage.content : '';
    const messageDate = lastMessage ? lastMessage.date.split('T')[0] : '';

    return (
        <div className={styles.contact} onClick={onClick}>
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
    );
};

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
    onClick: PropTypes.func.isRequired,
};

Contact.defaultProps = {
    username: {
        name: 'John Doe',
        state: 'available',
    },
    lastMessage: null,
    onClick: () => {},
};

export default Contact;