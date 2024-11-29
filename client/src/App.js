import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Register from './pages/Register';
import Admin from './pages/Admin';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Router>
    );
}

export default App;
