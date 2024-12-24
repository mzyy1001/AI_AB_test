import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../css/Login.module.css';
import showPasswordIcon from '../public/show-password.png';
import hidePasswordIcon from '../public/hide-password.png';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <div className={styles.pageContainer}>
            {/* Header with back arrow, dot, and gray cutoff line */}
            <header className={styles.header}>
                <div className={styles.icon}>
                    <Link to="/" className={styles.arrow}></Link>
                </div>
                <span className={styles.grayDot}></span>
            </header>
            <div className={styles.cutoffLine}></div>

            <div className={styles.body}>
                <h1 className={styles.heading}>Log in</h1>

                <form onSubmit={handleLogin}>
                    <label className={styles.label} htmlFor="email">
                        Email address or user name
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />

                    <label className={styles.passwordLabelRow}>
                        Password
                        <span
                            className={styles.togglePassword}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <img
                                src={showPassword ? showPasswordIcon : hidePasswordIcon}
                                alt={showPassword ? "Show icon" : "Hide icon"}
                                className={styles.passwordIcon}
                            />
                            {showPassword ? "Show" : "Hide"}
                        </span>
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <p className={styles.label}>
                        By continuing, you agree to our Terms of Policy and Private Policy
                    </p>

                    <button type="submit" className={styles.button}>
                        Login
                    </button>

                </form>

                <p className={`${styles.paragraph} ${styles.paragraphCenter}`}>
                    <Link to="/forgetpassword" className={styles.link}>
                        Forget your password
                    </Link>
                </p>
                <p className={`${styles.paragraph} ${styles.paragraphCenter}`}>
                    Don't have an account?{' '}
                    <Link to="/register" className={styles.link}>
                        Register here
                    </Link>
                </p>

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

export default Login;
