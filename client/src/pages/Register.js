// client/src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api'; // Adjust if needed

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await axios.post(`${API_URL}/auth/register`, { name, email, password });
            setSuccess('Registration successful! Please log in.');
            setTimeout(() => navigate('/login'), 2000); // Redirect to login
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ margin: '1rem 0' }}>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                </div>
                <div style={{ margin: '1rem 0' }}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                </div>
                <div style={{ margin: '1rem 0' }}>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;