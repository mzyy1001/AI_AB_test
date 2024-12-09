import React, { useState, useEffect } from 'react';
import styles from '../css/Register.module.css'; // Path should be correct
//import logo from '../logos/blacklogo.png'; // Ensure the logo path is accurate

function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false); // State to manage modal visibility for errors
    const [errorMessage, setErrorMessage] = useState(''); // Store the error message
    const [fade, setFade] = useState(false); // State to control fade effect

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });

            if (response.ok) {
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Registration failed. Please try again.');
                setIsError(true); // Show error modal
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An unexpected error occurred. Please try again later.');
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
                <h1 className={styles.heading}>Register</h1>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <button type="submit" className={styles.button}>
                        Register
                    </button>
                </form>
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

export default Register;
