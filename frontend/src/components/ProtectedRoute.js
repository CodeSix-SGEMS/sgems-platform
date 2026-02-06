import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    // If user is NOT logged in, kick them to Login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user IS logged in, let them see the page
    return children;
};

export default ProtectedRoute;