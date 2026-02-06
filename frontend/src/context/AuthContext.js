import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. INITIALIZE STATE FROM STORAGE
    // Instead of starting with 'null', we check if data already exists in the browser.
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // 2. LOGIN FUNCTION
    const login = (userData) => {
        setUser(userData);
        // Save to browser hard drive
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // 3. LOGOUT FUNCTION
    const logout = () => {
        setUser(null);
        // Clear from browser hard drive
        localStorage.removeItem('user');
    };

    // Optional: Sync state if external changes happen (safety check)
    useEffect(() => {
        // This ensures if you manually clear cookies, the app reacts
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};