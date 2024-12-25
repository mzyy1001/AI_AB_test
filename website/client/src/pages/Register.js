import React, { useState, useEffect } from 'react';
import styles from '../css/Register.module.css';
import { Link, useNavigate } from 'react-router-dom';

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
    const isPasswordValid = password.length > 0; // Validate password length (at least 6 characters)
    const navigate = useNavigate();

    const handleNextStep = () => {
        if (currentStep === 1 && !isEmailValid) {
            setErrorMessage('Please enter a valid email.');
            setIsError(true);
            return;
        }
        if (currentStep === 2 && !isNameValid) {
            setErrorMessage('Please enter your name.');
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
                body: JSON.stringify({
                    email,
                    password,
                    name,
                    firstName: null,
                    lastName: null,
                    company: null,
                    jobTitle: null,
                    phone: null,
                    country: null,
                    productsInterested: null
                }),
            });
            if (response.ok) {
                window.location.href = '/successPage';
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Registration failed. Please try again.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An unexpected error occurred. Please try again later.');
            setIsError(true);
        }
    };

    // Intercept the Enter key: move to next step if not on final step
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && currentStep < 3) {
            e.preventDefault();
            handleNextStep();
        }
    };

    const closeBanner = () => {
        setFade(true);
        setTimeout(() => setIsError(false), 1000);
    };

    useEffect(() => {
        if (isError) {
            setFade(false);
            const timer = setTimeout(() => {
                setFade(true);
                setTimeout(() => setIsError(false), 1000);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isError]);

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div
                    className={styles.icon}
                    onClick={() => {
                        if (currentStep === 1) {
                            navigate('/');
                        } else {
                            handlePrevStep();
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <Link className={styles.arrow}></Link>
                </div>
                <span className={styles.grayDot}></span>
            </header>
            <div className={styles.cutoffLine}></div>
            <div className={styles.body}>
                <header className={styles.headerTitle}>
                    <h1 className={styles.heading}>Create an account</h1>
                    <p className={styles.subtitle}>
                        Already have an account? <a href="/login" className={styles.link}>Log in</a>.
                    </p>
                </header>

                <div className={styles.stepTracker}>
                    <div className={styles.stepItem}>
                        <span className={`${styles.step} ${currentStep === 1 ? styles.activeStep : ''}`}>1</span>
                        <p className={`${styles.stepSubtitle} ${currentStep === 1 ? styles.activeSubtitle : ''}`}>
                            Enter your email address
                        </p>
                    </div>
                    <div className={styles.stepItem}>
                        <span className={`${styles.step} ${currentStep === 2 ? styles.activeStep : ''}`}>2</span>
                        <p className={`${styles.stepSubtitle} ${currentStep === 2 ? styles.activeSubtitle : ''}`}>
                            Provide your basic info
                        </p>
                    </div>
                    <div className={styles.stepItem}>
                        <span className={`${styles.step} ${currentStep === 3 ? styles.activeStep : ''}`}>3</span>
                        <p className={`${styles.stepSubtitle} ${currentStep === 3 ? styles.activeSubtitle : ''}`}>
                            Create your password
                        </p>
                    </div>
                </div>

                {/* Apply onKeyDown to intercept Enter key */}
                <form onSubmit={handleRegister} onKeyDown={handleKeyDown} className={styles.form}>
                    {currentStep === 1 && (
                        <div className={styles.inputContainer}>
                            <label className={styles.inputComment}>What's your email?</label>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>
                    )}
                    {currentStep === 2 && (
                        <div className={styles.inputContainer}>
                            <label className={styles.inputComment}>Company name</label>
                            <input
                                type="text"
                                placeholder="Enter your company name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>
                    )}
                    {currentStep === 3 && (
                        <div className={styles.inputContainer}>
                            <label className={styles.inputComment}>Create password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>
                    )}

                    <div className={styles.actions}>
                        {currentStep < 3 && (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className={`${styles.buttonPrimary} ${
                                    (currentStep === 1 && !isEmailValid) ||
                                    (currentStep === 2 && !isNameValid)
                                        ? styles.disabled
                                        : ''
                                }`}
                                disabled={
                                    (currentStep === 1 && !isEmailValid) ||
                                    (currentStep === 2 && !isNameValid)
                                }
                            >
                                Next
                            </button>
                        )}
                        {currentStep === 3 && (
                            <button
                                type="submit"
                                className={`${styles.buttonPrimary} ${!isPasswordValid ? styles.disabled : ''}`}
                                disabled={!isPasswordValid}
                            >
                                Register
                            </button>
                        )}
                    </div>
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

export default Register;