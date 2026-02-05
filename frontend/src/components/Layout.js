import React from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

function Layout({ children }) {
    const location = useLocation();

    // Don't show Sidebar on the Login page
    if (location.pathname === '/login') {
        return <div className="container-fluid p-0">{children}</div>;
    }

    return (
        <div className="d-flex">
            {/* Sidebar (Fixed width) */}
            <Sidebar />

            {/* Main Content Area (Fills the rest) */}
            <div className="flex-grow-1 p-4 bg-light" style={{ marginLeft: '250px', minHeight: '100vh' }}>
                {children}
            </div>
        </div>
    );
}

export default Layout;