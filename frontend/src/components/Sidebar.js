import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaUsers, FaSolarPanel, FaSignOutAlt, FaLeaf } from 'react-icons/fa';

function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation(); // To highlight the active link
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="d-flex flex-column p-3 text-white bg-dark vh-100" style={{ width: '250px', position: 'fixed' }}>
            <div className="d-flex align-items-center mb-4 text-decoration-none text-white">
                <FaLeaf className="me-2 text-success" size={24} />
                <span className="fs-4 fw-bold">SGEMS</span>
            </div>

            <hr />

            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item mb-2">
                    <Link to="/" className={`nav-link text-white ${location.pathname === '/' ? 'active bg-success' : ''}`}>
                        <FaHome className="me-2" /> Dashboard
                    </Link>
                </li>

                {/* Only show Admin Panel if user is Admin */}
                {user && user.role === 'ADMIN' && (
                    <li className="nav-item mb-2">
                        <Link to="/admin" className={`nav-link text-white ${location.pathname === '/admin' ? 'active bg-success' : ''}`}>
                            <FaUsers className="me-2" /> User Management
                        </Link>
                    </li>
                )}

                {/* Future Feature Placeholder */}
                <li className="nav-item mb-2">
                    <Link to="/devices" className={`nav-link text-white ${location.pathname === '/devices' ? 'active bg-success' : ''}`}>
                        <FaSolarPanel className="me-2" /> My Devices
                    </Link>
                </li>
            </ul>

            <hr />

            <div className="dropdown">
                <div className="d-flex align-items-center text-white text-decoration-none">
                    <div className="rounded-circle bg-success d-flex justify-content-center align-items-center me-2" style={{width: '32px', height: '32px'}}>
                        {user?.fullName.charAt(0)}
                    </div>
                    <strong>{user?.fullName}</strong>
                </div>
                <button onClick={handleLogout} className="btn btn-outline-danger w-100 mt-3 btn-sm">
                    <FaSignOutAlt className="me-2" /> Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;