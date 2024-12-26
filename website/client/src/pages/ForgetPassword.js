import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../css/ForgetPassword.module.css';
import logo from '../public/logo.png';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isError, setIsError] = useState(false); // State to manage modal visibility for errors
    const [errorMessage, setErrorMessage] = useState(''); // Store the error message
    const [fade, setFade] = useState(false); // State to control fade effect
    
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
            window.location.href = '/register';
        } catch (error) {
            console.error(error);
            setErrorMessage('Login failed. Please try again later.');
            setIsError(true); // Show error modal
        }
    };

    const closeBanner = () => {
        setFade(true); // Trigger the fade-out effect
        setTimeout(() => setIsError(false), 1000); // Hide the banner after the fade-out duration
    };

    useEffect(() => {
        if (isError) {
            setFade(false); // Reset the fade effect when a new error occurs
            const timer = setTimeout(() => {
                setFade(true); // Trigger fade-out after 5 seconds automatically
                setTimeout(() => setIsError(false), 1000); // Hide the banner after fade-out
            }, 5000);
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [isError]);

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.icon}>
                    <Link to="/" className={styles.arrow}></Link>
                </div>
                <div className={styles.logo} >
                    <img src={logo} alt="Logo" style={{
                        height: "40px",
                        width: "75px",
                        display: "block",
                    }} />
                </div>
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

                {isError && (
                    <div className={`${styles.errorBanner} ${fade ? styles.fadeOut : ''}`}>
                        <div className={styles.errorContent}>
                            <p className={styles.errorMessage}>{errorMessage}</p>
                            <button onClick={closeBanner} className={styles.closeButton}>
                                &times;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;