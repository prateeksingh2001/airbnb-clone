// client/src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, setAuthData } = useContext(AuthContext);

    const handleLogout = () => {
        setAuthData(null); // This clears token and state
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '1rem', background: '#eee' }}>
            <Link to="/">Home</Link>
            {isAuthenticated ? (
                <>
                    <span>Welcome, {user?.name || 'User'}!</span>
                    <Link to="/my-bookings">My Bookings</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;