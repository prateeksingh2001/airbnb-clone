// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthDataState] = useState({
        token: localStorage.getItem('token'),
        user: null,
        isAuthenticated: false,
        loading: true,
    });

    // Function to set auth data in state and local storage
    const setAuthData = (data) => {
        if (data) {
            localStorage.setItem('token', data.token);
            setAuthDataState({
                token: data.token,
                user: data.user,
                isAuthenticated: true,
                loading: false,
            });
            // Set the token in axios headers
            axios.defaults.headers.common['x-auth-token'] = data.token;
        } else {
            localStorage.removeItem('token');
            setAuthDataState({
                token: null,
                user: null,
                isAuthenticated: false,
                loading: false,
            });
            // Remove token from axios headers
            delete axios.defaults.headers.common['x-auth-token'];
        }
    };

    // On initial load, check for token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // TODO: Add a call to a '/api/auth/validate' endpoint
            // to verify the token is still valid and get user data.
            // For simplicity, we'll assume the token is valid if it exists.
            // A better implementation would fetch user data here.
            // For now, we just set the token.
            setAuthData({ token, user: { id: 'temp' } }); // Simplified
        } else {
            setAuthData(null);
        }
        // This effect should only run once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider value={{ ...authData, setAuthData }}>
            {!authData.loading && children}
        </AuthContext.Provider>
    );
};