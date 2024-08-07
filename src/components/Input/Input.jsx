import React from 'react'
import PropTypes from 'prop-types'
import styles from './Input.module.css'

const Input = ({ id, label, error, value, onChange, ...props  }) => (
    <div className={styles.container}>
        {label && 
        <label 
            className={styles.label}
            htmlFor={id}
        >{label}</label>}
        <input 
            id={id}
            className={styles.input + (error ? ' ' + styles.error : '')} 
            value={value} 
            onChange={onChange} 
            {...props}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
)

Input.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    error: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
}

Input.defaultProps = {
    label: null,
    error: null,
    value: null,
    onChange: null
}

export default Input