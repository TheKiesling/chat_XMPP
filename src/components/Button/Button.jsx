import React from 'react'
import PropTypes from 'prop-types'
import styles from './Button.module.css'

const Button = ({ children, onClick, disabled, primary }) => (
    <button 
        className={styles.button + (primary ? ' ' + styles.primary : ' ' + styles.secondary)}
        onClick={onClick} 
        disabled={disabled}
    >
        {children}
    </button>
)

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    primary: PropTypes.bool
}

Button.defaultProps = {
    children: null,
    onClick: null,
    disabled: false,
    primary: false
}

export default Button