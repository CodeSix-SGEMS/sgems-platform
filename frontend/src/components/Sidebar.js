import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
    FaHome, FaSolarPanel, FaFileInvoiceDollar, FaTools,
    FaExclamationTriangle, FaBoxOpen, FaSignOutAlt, FaFileAlt, FaUsers
} from 'react-icons/fa';

function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.info("See you soon! 👋"); // <--- The nice touch
        navigate('/login');
    };

    return (
        <div
            className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
            style={{
                width: '250px', height: '100vh', position: 'fixed', top: 0, left: 0, overflowY: 'auto', zIndex: 1000
            }}
        >
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4 fw-bold text-success">🌱 SGEMS</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">

                {/* 1. DASHBOARD */}
                <li className="nav-item mb-2">
                    <Link to="/dashboard" className={`nav-link text-white ${location.pathname === '/dashboard' ? 'active bg-success' : ''}`}>
                        <FaHome className="me-2" /> Dashboard
                    </Link>
                </li>

                {/* 2. USER MANAGEMENT (Restored - Admin Only) */}
                {user && user.role === 'ADMIN' && (
                    <li className="nav-item mb-2">
                        <Link to="/admin" className={`nav-link text-white ${location.pathname === '/admin' ? 'active bg-success' : ''}`}>
                            <FaUsers className="me-2" /> User Management
                        </Link>
                    </li>
                )}

                {/* 3. YOUR MODULE */}
                <li className="nav-item mb-2">
                    <Link to="/devices" className={`nav-link text-white ${location.pathname === '/devices' ? 'active bg-success' : ''}`}>
                        <FaSolarPanel className="me-2" /> My Sites (Sushen)
                    </Link>
                </li>

                {/* 4. TEAM MODULES */}
                <li className="nav-item mb-2">
                    <Link to="/billing" className={`nav-link text-white ${location.pathname === '/billing' ? 'active bg-success' : ''}`}>
                        <FaFileInvoiceDollar className="me-2" /> Billing (Muditha)
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link to="/maintenance" className={`nav-link text-white ${location.pathname === '/maintenance' ? 'active bg-success' : ''}`}>
                        <FaTools className="me-2" /> Maintenance (Sehath)
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link to="/alerts" className={`nav-link text-white ${location.pathname === '/alerts' ? 'active bg-success' : ''}`}>
                        <FaExclamationTriangle className="me-2" /> System Alerts (Kavidu)
                    </Link>
                </li>

                {/* 5. INVENTORY (Admin Only) */}
                {user && user.role === 'ADMIN' && (
                    <li className="nav-item mb-2">
                        <Link to="/inventory" className={`nav-link text-white ${location.pathname === '/inventory' ? 'active bg-success' : ''}`}>
                            <FaBoxOpen className="me-2" /> Inventory (Senithu)
                        </Link>
                    </li>
                )}

                {/* 6. REPORTS (Restored - The Central Hub) */}
                <li className="nav-item mb-2 mt-3 pt-3 border-top">
                    <div className="text-muted small mb-2 text-uppercase ms-2">Analytics</div>
                    <Link to="/reports" className={`nav-link text-white ${location.pathname === '/reports' ? 'active bg-success' : ''}`}>
                        <FaFileAlt className="me-2" /> All Reports
                    </Link>
                </li>

            </ul>
            <hr />
            <div className="dropdown">
                <button onClick={handleLogout} className="btn btn-danger w-100">
                    <FaSignOutAlt className="me-2" /> Logout
                </button>
            </div>
        </div>

    );
}

export default Sidebar;