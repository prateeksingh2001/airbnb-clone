// client/src/pages/Login.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Set the base URL for API requests
const API_URL = 'http://localhost:5000/api'; // Adjust if your codespace forwards a different port

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setAuthData } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });

            // Store token and user data in context and local storage
            setAuthData(res.data);

            navigate('/'); // Redirect to home page
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed. Please try again.');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ margin: '1rem 0' }}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                </div>
                <div style={{ margin: '1rem 0' }}>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;