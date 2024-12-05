import React, { useState } from 'react';
import styles from '../css/Register.module.css'; // Path should be correct
import logo from '../logos/blacklogo.png'; // Ensure the logo path is accurate

function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleRegister = async () => {
        // Registration logic
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" />
                </div>
                <h1 className={styles.heading}>Create an account</h1>
                {step === 1 && (
                    <div>
                        <p className={styles.paragraph}>Enter your email address</p>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                        <button
                            onClick={nextStep}
                            disabled={!email}
                            className={styles.button}
                        >
                            Next
                        </button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <p className={styles.paragraph}>Provide your basic info</p>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            required
                        />
                        <button onClick={prevStep} className={styles.button}>
                            Back
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={!name}
                            className={styles.button}
                        >
                            Next
                        </button>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <p className={styles.paragraph}>Create your password</p>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                        <button onClick={prevStep} className={styles.button}>
                            Back
                        </button>
                        <button
                            onClick={handleRegister}
                            disabled={!password}
                            className={styles.button}
                        >
                            Register
                        </button>
                    </div>
                )}
                <p className={styles.paragraph}>
                    Already have an account?{' '}
                    <a href="/login" className={styles.link}>
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Register;
