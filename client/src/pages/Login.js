import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../css/Login.module.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false); // State to manage modal visibility for errors
    const [errorMessage, setErrorMessage] = useState(''); // Store the error message
    const [fade, setFade] = useState(false); // State to control fade effect


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/login', {
                email,
                password,
            });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/user';
        } catch (error) {
            console.error('Login failed:', error.response?.data);
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
        <div className={styles.body}>
            <div className={styles.container}>
                <h1 className={styles.heading}>Login</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>Login</button>
                </form>
                <p className={styles.paragraph}>
                    Don't have an account? <Link to="/register" className={styles.link}>Register here</Link>
                </p>
            </div>

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
    );
}

export default Login;
