import React, { useState } from 'react'
import styles from './Login.module.css'
import LoginForm from '../../forms/LoginForm'
import SignupForm from '../../forms/SignupForm'
import Button from '../../components/Button'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const Login = () => {
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [showSignupForm, setShowSignupForm] = useState(false);

    const handleShowLoginForm = () => {
        setShowLoginForm(true);
        setShowSignupForm(false);
    }

    const handleShowSignupForm = () => {
        setShowLoginForm(false);
        setShowSignupForm(true);
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttons}>
                <Button 
                    children="Login"
                    onClick={handleShowLoginForm}
                    primary = {showLoginForm}
                />
                <Button 
                    children="Sign Up"
                    onClick={handleShowSignupForm}
                    primary = {showSignupForm}
                />
            </div>
            {showLoginForm && <LoginForm />}
            {showSignupForm && <SignupForm />}
        </div>
    )

}

export default Login