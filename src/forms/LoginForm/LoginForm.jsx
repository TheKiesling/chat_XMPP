import React, { useEffect } from 'react';
import styles from './LoginForm.module.css';
import Input from '../../components/Input';
import Button from '../../components/Button';
import loginSchema from './loginSchema';
import useForm from '../../hooks/useForm';
import useLogin from '../../hooks/useLogin';

const LoginForm = () => {
    const {
        form, error: formError, setData, validateForm, validateField, clearFieldError, clearFormErrors
    } = useForm({ schema: loginSchema });

    const { login, success, error, loading } = useLogin();


    const handleChange = (e) => {
        const { id, value } = e.target;
        setData(id, value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearFormErrors();
        const errors = await validateForm();
        if (errors) return;
    
        login({
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
                    children="Login"
                    primary
                    disabled={loading}
                />
            </form>
            {error && <p className={styles.error}>Error: {error.message}</p>}
        </div>
    )
}

export default LoginForm;