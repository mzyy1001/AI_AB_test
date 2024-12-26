import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/Login.module.css';

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/admin/login', { username, password });
            const token = response.data.token;
            localStorage.setItem('adminToken', token);
            window.location.href = '/admin';
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default AdminLogin;