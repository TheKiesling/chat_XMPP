import React, { useEffect } from 'react'
import styles from './LoginForm.module.css'
import Input from '../../components/Input'
import Button from '../../components/Button'

const LoginForm = () => {

    useEffect(() => {
        document.title = 'Login'
    }, [])

    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <Input 
                    id="username" 
                    label="Username" 
                    type="text" 
                />
                <Input 
                    id="password" 
                    label="Password" 
                    type="password" 
                />
                <Button 
                    children="Login"
                    primary
                />
            </form>
        </div>
    )
}

export default LoginForm