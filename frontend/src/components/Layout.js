import React from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

function Layout({ children }) {
    const location = useLocation();

    // Define "Public" pages that should NOT have a sidebar
    const publicRoutes = ['/', '/login', '/register', '/forgot-password'];

    // If the current path is in the public list, return PLAIN content
    if (publicRoutes.includes(location.pathname)) {
        return <div className="container-fluid p-0">{children}</div>;
    }

    // Otherwise, show the Sidebar Layout
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-4 bg-light" style={{ marginLeft: '250px', minHeight: '100vh' }}>
                {children}
            </div>
        </div>
    );
}

export default Layout;