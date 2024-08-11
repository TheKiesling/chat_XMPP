import React from 'react'
import PropTypes from 'prop-types'
import styles from './Button.module.css'

const Button = ({ children, onClick, disabled, primary, icon }) => (
    <button 
        className={styles.button + (primary ? ' ' + styles.primary : ' ' + styles.secondary)}
        onClick={onClick} 
        disabled={disabled}
    >
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
    </button>
)

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    primary: PropTypes.bool,
    icon: PropTypes.node,
}

Button.defaultProps = {
    children: null,
    onClick: null,
    disabled: false,
    primary: false,
    icon: null, 
}

export default Button
