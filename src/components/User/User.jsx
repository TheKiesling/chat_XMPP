import React from 'react';
import PropTypes from 'prop-types';
import styles from './User.module.css';
import ProfilePhoto from '../ProfilePhoto';
import Button from '../Button';
import { Add } from '@mui/icons-material';

const User = ({ user }) => {

    const userState = user.state;
    const usernameInitial = user.name[0].toUpperCase();

    return (
        <div className={styles.user} >
            <ProfilePhoto initial={usernameInitial} state={userState} />
            <div className={styles.info}>
                <div className={styles.username}>{user.name}</div>
                <Button icon={<Add />} />
            </div>
        </div>
    );
};

User.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        state: PropTypes.oneOf(['available', 'absent', 'notAvailable', 'busy', 'away']).isRequired,
    }),
};

User.defaultProps = {
    user: {
        name: 'John Doe',
        state: 'away',
    },
};

export default User;