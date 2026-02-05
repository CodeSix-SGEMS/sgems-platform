import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import Context

function Navbar() {
    const { user, logout } = useContext(AuthContext); // Get user & logout function
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">SGEMS Platform</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Dashboard</Link>
                        </li>
                        {/* Show Admin Link ONLY if role is ADMIN */}
                        {user && user.role === 'ADMIN' && (
                            <li className="nav-item">
                                <Link className="nav-link text-warning" to="/admin">Admin Panel</Link>
                            </li>
                        )}
                    </ul>

                    {/* Dynamic Section */}
                    <div className="d-flex">
                        {user ? (
                            <div className="d-flex align-items-center">
                                <span className="text-light me-3">Hello, {user.fullName}</span>
                                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
                            </div>
                        ) : (
                            <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;