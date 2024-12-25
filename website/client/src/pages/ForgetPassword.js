import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../css/ForgetPassword.module.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    // Email validation regex
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Example POST route (similar to register.js)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEmailValid) {
            // Optionally handle invalid email submission
            return;
        }
        try {
            // const response = await axios.post('/users/forgotpassword', { email });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.icon}>
                    <Link to="/" className={styles.arrow}></Link>
                </div>
                <span className={styles.grayDot}></span>
            </header>
            <div className={styles.cutoffLine}></div>

            <div className={styles.body}>
                <form onSubmit={handleSubmit} className={styles.registrationContainer}>
                    <h1 className={styles.maintitle}>Forgot password</h1>
                    <h2 className={styles.subtitle}>
                        Enter your email for the verification process. A reset password link will be sent to your email.
                    </h2>
                    <label htmlFor="email" className={styles.label}>E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        placeholder="example@gmail.com"
                    />
                    <button
                        type="submit"
                        disabled={!isEmailValid}
                        className={`${styles.continueButton} ${!isEmailValid ? styles.disabled : ''}`}
                    >
                        CONTINUE
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;