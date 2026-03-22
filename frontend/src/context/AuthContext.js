import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

// Helper — load user only if session hasn't expired
const loadUserFromStorage = () => {
    try {
        const savedUser = localStorage.getItem('user');
        const savedExpiry = localStorage.getItem('userExpiry');
        if (!savedUser || !savedExpiry) return null;
        if (Date.now() > parseInt(savedExpiry, 10)) {
            // Session expired — clean up
            localStorage.removeItem('user');
            localStorage.removeItem('userExpiry');
            return null;
        }
        return JSON.parse(savedUser);
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {

    // 1. INITIALIZE STATE FROM STORAGE (with expiry check)
    const [user, setUser] = useState(() => loadUserFromStorage());

    // 2. LOGIN FUNCTION
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userExpiry', (Date.now() + SESSION_DURATION_MS).toString());
    };

    // 3. LOGOUT FUNCTION
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userExpiry');
    };

    // 4. On app load — sync state and check expiry
    useEffect(() => {
        const validUser = loadUserFromStorage();
        if (validUser) {
            setUser(validUser);
        } else {
            setUser(null);
        }
    }, []);

    // 5. Check expiry every 60 seconds while app is open
    useEffect(() => {
        const interval = setInterval(() => {
            const validUser = loadUserFromStorage();
            if (!validUser && user) {
                // Session expired while user was active
                setUser(null);
            }
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};