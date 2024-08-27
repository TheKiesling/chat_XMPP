import React from 'react'
import PropTypes from 'prop-types'
import styles from './Group.module.css'
import ProfilePhoto from '../ProfilePhoto'


const Group = ({ groupName, onClick }) => {
  
    const groupNameInitial = groupName[0].toUpperCase()
    return (
        <div className={styles.group} onClick={onClick}>
            <ProfilePhoto initial={groupNameInitial} />
            <div className={styles.info}>
                <div className={styles.groupName}>{groupName}</div>
            </div>
        </div>
    )
}

Group.propTypes = {
    groupName: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
}

export default Group