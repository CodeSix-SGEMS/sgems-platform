import React, { useContext } from 'react';
import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
    FaHome, FaSolarPanel, FaFileInvoiceDollar, FaTools,
    FaExclamationTriangle, FaBoxOpen, FaSignOutAlt, FaFileAlt, FaUsers, FaBolt, FaCog
} from 'react-icons/fa';

function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.info("See you soon! 👋");
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

                :root {
                    --forest: #1a3a2a;
                    --moss: #2d5a3d;
                    --sage: #5a8a6a;
                    --mint: #a8d5b5;
                    --cream: #f5f0e8;
                    --warm-white: #fdfaf5;
                    --gold: #c9a84c;
                }

                .gg-sidebar {
                    width: 250px;
                    height: 100vh;
                    position: fixed;
                    top: 0; left: 0;
                    overflow-y: auto;
                    z-index: 1000;
                    background: var(--forest);
                    display: flex;
                    flex-direction: column;
                    font-family: 'DM Sans', sans-serif;
                }

                .gg-sidebar::-webkit-scrollbar { width: 3px; }
                .gg-sidebar::-webkit-scrollbar-track { background: transparent; }
                .gg-sidebar::-webkit-scrollbar-thumb { background: rgba(168,213,181,0.2); border-radius: 4px; }

                /* Ambient texture overlay */
                .gg-sidebar::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse at 20% 15%, rgba(168,213,181,0.07) 0%, transparent 55%),
                        radial-gradient(ellipse at 85% 85%, rgba(201,168,76,0.05) 0%, transparent 50%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* Brand */
                .gg-sb-brand {
                    padding: 26px 20px 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-bottom: 1px solid rgba(168,213,181,0.1);
                    position: relative;
                    z-index: 1;
                    text-decoration: none;
                }
                .gg-sb-brand:hover { text-decoration: none; }

                .gg-sb-logo-mark {
                    width: 34px; height: 34px;
                    background: linear-gradient(135deg, var(--moss), var(--sage));
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--mint);
                    font-size: 14px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                    flex-shrink: 0;
                }

                .gg-sb-brand-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 17px;
                    font-weight: 700;
                    color: var(--warm-white);
                    letter-spacing: -0.2px;
                    display: block;
                    line-height: 1.2;
                }
                .gg-sb-brand-sub {
                    font-size: 9.5px;
                    font-weight: 400;
                    color: rgba(168,213,181,0.4);
                    letter-spacing: 1.8px;
                    text-transform: uppercase;
                    display: block;
                    margin-top: 1px;
                }

                /* User pill */
                .gg-sb-user {
                    margin: 14px 14px 6px;
                    padding: 10px 12px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(168,213,181,0.1);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    position: relative;
                    z-index: 1;
                }
                .gg-sb-avatar {
                    width: 30px; height: 30px;
                    background: linear-gradient(135deg, var(--sage), var(--mint));
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--forest);
                    flex-shrink: 0;
                }
                .gg-sb-user-name {
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--warm-white);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .gg-sb-user-role {
                    font-size: 9.5px;
                    color: rgba(168,213,181,0.5);
                    font-weight: 400;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                /* Nav */
                .gg-sb-nav {
                    flex: 1;
                    padding: 10px 12px 8px;
                    position: relative;
                    z-index: 1;
                }

                .gg-sb-section {
                    font-size: 9.5px;
                    font-weight: 500;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: rgba(168,213,181,0.3);
                    padding: 10px 10px 6px;
                }

                .gg-sb-divider {
                    height: 1px;
                    background: rgba(168,213,181,0.08);
                    margin: 6px 10px 10px;
                }

                .gg-sb-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 9px 12px;
                    border-radius: 10px;
                    text-decoration: none;
                    color: rgba(245,240,232,0.52);
                    font-size: 13.5px;
                    font-weight: 400;
                    margin-bottom: 2px;
                    position: relative;
                    transition: color 0.2s, background 0.2s;
                }
                .gg-sb-link:hover {
                    color: var(--warm-white);
                    background: rgba(168,213,181,0.07);
                    text-decoration: none;
                }
                .gg-sb-link.active {
                    background: linear-gradient(135deg, rgba(45,90,61,0.85), rgba(90,138,106,0.45));
                    color: var(--warm-white);
                    border: 1px solid rgba(168,213,181,0.14);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.18), inset 0 1px 0 rgba(168,213,181,0.12);
                }
                .gg-sb-link.active::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 50%;
                    transform: translateY(-50%);
                    width: 3px; height: 55%;
                    background: var(--gold);
                    border-radius: 0 3px 3px 0;
                }

                .gg-sb-icon {
                    font-size: 13px;
                    width: 17px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    transition: transform 0.2s;
                }
                .gg-sb-link:hover .gg-sb-icon,
                .gg-sb-link.active .gg-sb-icon { transform: scale(1.12); }

                .gg-sb-label { flex: 1; }

                .gg-sb-suffix {
                    font-size: 10px;
                    color: rgba(168,213,181,0.3);
                }
                .gg-sb-link.active .gg-sb-suffix { color: rgba(168,213,181,0.5); }

                /* Footer */
                .gg-sb-footer {
                    padding: 10px 12px 20px;
                    border-top: 1px solid rgba(168,213,181,0.08);
                    position: relative;
                    z-index: 1;
                }
                .gg-sb-logout {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 11px 12px;
                    border-radius: 10px;
                    background: rgba(220,60,60,0.1);
                    border: 1px solid rgba(220,60,60,0.18);
                    color: rgba(255,150,140,0.75);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13.5px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .gg-sb-logout:hover {
                    background: rgba(220,60,60,0.2);
                    color: #ffb3aa;
                    border-color: rgba(220,60,60,0.32);
                    transform: translateY(-1px);
                }
            `}</style>

            <div className="gg-sidebar">

                {/* Brand — links to home just like original */}
                <a href="/" className="gg-sb-brand">
                    <div className="gg-sb-logo-mark"><FaBolt /></div>
                    <div>
                        <span className="gg-sb-brand-name">SGEMS</span>
                        <span className="gg-sb-brand-sub">GreenGrid</span>
                    </div>
                </a>

                {/* User pill */}
                {user && (
                    <div className="gg-sb-user">
                        <div className="gg-sb-avatar">
                            {user.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div className="gg-sb-user-name">{user.fullName}</div>
                            <div className="gg-sb-user-role">{user.role}</div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="gg-sb-nav">
                    <div className="gg-sb-section">Main</div>

                    {/* 1. Dashboard */}
                    <Link to="/dashboard" className={`gg-sb-link${isActive('/dashboard') ? ' active' : ''}`}>
                        <span className="gg-sb-icon"><FaHome /></span>
                        <span className="gg-sb-label">Dashboard</span>
                    </Link>

                    {/* 2. User Management — Admin only */}
                    {user && user.role === 'ADMIN' && (
                        <Link to="/admin" className={`gg-sb-link${isActive('/admin') ? ' active' : ''}`}>
                            <span className="gg-sb-icon"><FaUsers /></span>
                            <span className="gg-sb-label">User Management</span>
                        </Link>
                    )}

                    {/* 3. My Sites */}
                    <Link to="/devices" className={`gg-sb-link${isActive('/devices') ? ' active' : ''}`}>
                        <span className="gg-sb-icon"><FaSolarPanel /></span>
                        <span className="gg-sb-label">My Sites</span>
                        <span className="gg-sb-suffix">(Sushen)</span>
                    </Link>

                    {/* 4. Team modules */}
                    <Link to="/billing" className={`gg-sb-link${isActive('/billing') ? ' active' : ''}`}>
                        <span className="gg-sb-icon"><FaFileInvoiceDollar /></span>
                        <span className="gg-sb-label">Billing</span>
                        <span className="gg-sb-suffix">(Muditha)</span>
                    </Link>

                    <Link to="/maintenance" className={`gg-sb-link${isActive('/maintenance') ? ' active' : ''}`}>
                        <span className="gg-sb-icon"><FaTools /></span>
                        <span className="gg-sb-label">Maintenance</span>
                        <span className="gg-sb-suffix">(Sehath)</span>
                    </Link>

                    <Link to="/alerts" className={`gg-sb-link${isActive('/alerts') ? ' active' : ''}`}>
                        <span className="gg-sb-icon"><FaExclamationTriangle /></span>
                        <span className="gg-sb-label">System Alerts</span>
                        <span className="gg-sb-suffix">(Kavidu)</span>
                    </Link>

                    {/* 5. Inventory — Admin only */}
                    {user && user.role === 'ADMIN' && (
                        <Link to="/inventory" className={`gg-sb-link${isActive('/inventory') ? ' active' : ''}`}>
                            <span className="gg-sb-icon"><FaBoxOpen /></span>
                            <span className="gg-sb-label">Inventory</span>
                            <span className="gg-sb-suffix">(Senithu)</span>
                        </Link>
                    )}

                    {/* Settings link */}
                    <Link to="/settings" className={`gg-sb-link${isActive('/settings') ? ' active' : ''}`}>
                        <span className="gg-sb-icon"><FaCog /></span>
                        <span className="gg-sb-label">Settings</span>
                    </Link>

                    {/* 6. Analytics section */}
                    <div className="gg-sb-divider" />
                    <div className="gg-sb-section">Analytics</div>

                    <Link to="/reports" className={`gg-sb-link${isActive('/reports') ? ' active' : ''}`}>
                        <span className="gg-sb-icon"><FaFileAlt /></span>
                        <span className="gg-sb-label">All Reports</span>
                    </Link>
                </nav>

                {/* Logout */}
                <div className="gg-sb-footer">
                    <button className="gg-sb-logout" onClick={handleLogout}>
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>

            </div>
        </>
    );
}

export default Sidebar;