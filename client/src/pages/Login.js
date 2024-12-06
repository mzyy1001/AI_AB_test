import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../logos/blacklogo.png';
import styles from '../css/Login.module.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/login', {
                email,
                password,
            });
            localStorage.setItem('token', response.data.token);
            alert('Login successful!');
            window.location.href = '/user';
        } catch (error) {
            console.error('Login failed:', error.response?.data);
            alert('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <img src={logo} alt="App Logo" />
                </div>
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
        </div>
    );
}

export default Login;
