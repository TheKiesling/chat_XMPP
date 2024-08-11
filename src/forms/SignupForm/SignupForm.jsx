// src/forms/SignupForm/SignupForm.jsx
import React from 'react';
import styles from './SignupForm.module.css';
import Input from '../../components/Input';
import Button from '../../components/Button';
import signupSchema from './signupSchema';
import useForm from '../../hooks/useForm';
import useSignup from '../../hooks/useSignup';

const SignupForm = () => {
    const { form, error: formError, setData, validateForm, validateField, clearFieldError, clearFormErrors } = useForm({ schema: signupSchema });
    const { signup, error, loading } = useSignup();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setData(id, value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearFormErrors();
        const errors = await validateForm();
        if (errors) return;
    
        signup({
            username: form.username,
            password: form.password,
        });
    }

    return (
        <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
            <Input 
            id="username" 
            label="Username" 
            type="text" 
            value={form?.username}
            onChange={handleChange}
            error={formError?.username}
            onBlur={() => validateField('username')}
            onFocus={() => clearFieldError('username')}
            />
            <Input 
            id="password" 
            label="Password" 
            type="password" 
            value={form?.password}
            onChange={handleChange}
            error={formError?.password}
            onBlur={() => validateField('password')}
            onFocus={() => clearFieldError('password')}
            />
            <Button 
            children="Signup"
            primary
            disabled={loading}
            />
            {error && <div className={styles.error}>{error.message}</div>}
        </form>
        </div>
    );
};

export default SignupForm;