import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

const loadUserFromStorage = () => {
    try {
        const savedUser = localStorage.getItem('user');
        const savedExpiry = localStorage.getItem('userExpiry');
        if (!savedUser || !savedExpiry) return null;
        if (Date.now() > parseInt(savedExpiry, 10)) {
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
    const [user, setUser] = useState(() => loadUserFromStorage());

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userExpiry', (Date.now() + SESSION_DURATION_MS).toString());
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userExpiry');
    };

    // ✅ ADD THIS BEFORE THE RETURN
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        // Keep existing expiry – do not change it
    };

    useEffect(() => {
        const validUser = loadUserFromStorage();
        if (validUser) {
            setUser(validUser);
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const validUser = loadUserFromStorage();
            if (!validUser && user) {
                setUser(null);
            }
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};