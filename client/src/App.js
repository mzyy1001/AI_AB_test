import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import UserPage from './pages/UserPage';
import AdminLogin from './pages/AdminLogin';

function App() {
    const [token, setToken] = useState(null);

    const handleLogin = (token) => {
        console.log('Setting token:', token); // Debugging log
        setToken(token);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} /> {/* Remove token check */}
                <Route path="/user" element={<UserPage />} />
                <Route path="/admin-login" element={<AdminLogin onLogin={handleLogin} />} />
            </Routes>
        </Router>
    );
}

export default App;