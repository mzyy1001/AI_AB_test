import React, { useState, useEffect } from 'react';
import styles from '../css/Register.module.css';
import { Link } from 'react-router-dom';

function Register() {
    const [currentStep, setCurrentStep] = useState(1); // State to track the current step
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false); // State to manage modal visibility for errors
    const [errorMessage, setErrorMessage] = useState(''); // Store the error message
    const [fade, setFade] = useState(false); // State to control fade effect

    const isNameValid = name.trim().length > 0; // Validate name
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Validate email
    const isPasswordValid = password.length >= 6; // Validate password length (at least 6 characters)

    const handleNextStep = () => {
        if (currentStep === 1 && !isNameValid) {
            setErrorMessage('Please enter your name.');
            setIsError(true);
            return;
        }
        if (currentStep === 2 && !isEmailValid) {
            setErrorMessage('Please enter a valid email.');
            setIsError(true);
            return;
        }
        setCurrentStep((prev) => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isPasswordValid) {
            setErrorMessage('Password must be at least 6 characters long.');
            setIsError(true);
            return;
        }
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
            <header className={styles.header}>
                <div className={styles.icon}>
                    <Link to="/" className={styles.arrow}></Link>
                </div>
                <span className={styles.grayDot}></span>
            </header>
            <div className={styles.cutoffLine}></div>
            {/* Header */}
            <header className={styles.headerTitle}>
                <h1 className={styles.heading}>Create an account</h1>
                <p className={styles.subtitle}>
                    Already have an account? <a href="/login" className={styles.link}>Log in here</a>.
                </p>
            </header>

            {/* Step Tracker */}
            <div className={styles.stepTracker}>
                <span className={`${styles.step} ${currentStep === 1 ? styles.activeStep : ''}`}>1</span>
                <span className={`${styles.step} ${currentStep === 2 ? styles.activeStep : ''}`}>2</span>
                <span className={`${styles.step} ${currentStep === 3 ? styles.activeStep : ''}`}>3</span>
            </div>

            {/* Form Content */}
            <form onSubmit={handleRegister} className={styles.form}>
                {currentStep === 1 && (
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                )}
                {currentStep === 2 && (
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                )}
                {currentStep === 3 && (
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className={styles.actions}>
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handlePrevStep}
                            className={styles.buttonSecondary}
                        >
                            Back
                        </button>
                    )}
                    {currentStep < 3 && (
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className={`${styles.buttonPrimary} ${(currentStep === 1 && !isNameValid) ||
                                    (currentStep === 2 && !isEmailValid)
                                    ? styles.disabled
                                    : ''
                                }`}
                            disabled={
                                (currentStep === 1 && !isNameValid) ||
                                (currentStep === 2 && !isEmailValid)
                            }
                        >
                            Next
                        </button>
                    )}
                    {currentStep === 3 && (
                        <button
                            type="submit"
                            className={`${styles.buttonPrimary} ${!isPasswordValid ? styles.disabled : ''
                                }`}
                            disabled={!isPasswordValid}
                        >
                            Register
                        </button>
                    )}
                </div>
            </form>

            {/* Error Banner */}
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
