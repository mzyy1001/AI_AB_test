import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import UserPage from './pages/UserPage';
import AdminLogin from './pages/AdminLogin';
import RechargePage from './pages/ReChargePage';
import SceneS from './pages/OneNebulaScene';

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/recharge" element={<RechargePage />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path='/scene' element={<SceneS />} />
            </Routes>
        </Router>
    );
}

export default App;