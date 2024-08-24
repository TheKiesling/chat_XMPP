import React from 'react';
import PropTypes from 'prop-types';
import styles from './UserList.module.css';
import User from '../User/User';

const UserList = ({ users, onSelectContact }) => {

    return (
        <div className={styles.userList}>
            {users.map(user => (
                <User
                    key={user.jid.split('@')[0]}
                    user={user}
                    onClick={() => onSelectContact(user.jid.split('@')[0])} 
                />
            ))}
        </div>
    );
};

UserList.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            state: PropTypes.string,
        })
    ).isRequired,
};

UserList.defaultProps = {
    users: [
        {
            name: 'John Doe',
            state: '',
        },
        {
            name: 'Jane Doe',
            state: 'busy',
        },
    ],
};

export default UserList;