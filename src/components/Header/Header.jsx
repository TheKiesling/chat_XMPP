import React from 'react'
import PropTypes from 'prop-types'
import styles from './Header.module.css'
import Button from '../Button'

const Header = ({ username }) => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <h1 className={styles.title}>Chat App</h1>
            </div>
            <div className={styles.user}>
                <span className={styles.username}>
                    Welcome, <b>{username}</b>
                </span>
                <Button
                    children="Logout"
                    secondary
                />
            </div>
        </header>
    )
}

Header.propTypes = {
    username: PropTypes.string.isRequired,
}

export default Header