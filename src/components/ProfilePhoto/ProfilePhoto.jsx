import React from 'react'
import PropTypes from 'prop-types'
import styles from './ProfilePhoto.module.css'

const ProfilePhoto = ({initial, state}) => {
  return (
    <div className={styles.profilePhoto}>
        <div className={styles.initial}>{initial}</div>
        <div className={styles[state]} />
    </div>
  )
}

ProfilePhoto.propTypes = {
    initial: PropTypes.string.isRequired,
    state: PropTypes.oneOf(['available', 'absent', 'notAvailable', 'busy', 'away']).isRequired,
}


export default ProfilePhoto
