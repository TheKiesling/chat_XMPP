import React from 'react';
import PropTypes from 'prop-types';
import styles from './User.module.css';
import ProfilePhoto from '../ProfilePhoto';
import Button from '../Button';
import { Add } from '@mui/icons-material';

const User = ({ user, onClick }) => {

    const userState = user.state;
    const usernameInitial = user.jid[0]?.toUpperCase();
    const userJID = user.jid;

    return (
        <div className={styles.user} onClick={onClick}>
            <ProfilePhoto initial={usernameInitial} state={userState} />
            <div className={styles.info}>
                <div className={styles.username}>{userJID.split('@')[0]}</div>
                <Button icon={<Add />} />
            </div>
        </div>
    );
};

User.propTypes = {
    user: PropTypes.shape({
        jid: PropTypes.string.isRequired,
        state: PropTypes.oneOf(['available', 'absent', 'notAvailable', 'busy', 'away']).isRequired,
    }),
};

User.defaultProps = {
    user: {
        jid: 'John Doe',
        state: 'unavailable',
    },
};

export default User;