import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBolt, FaUserShield, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

                .gg-navbar {
                    height: 56px;
                    background: rgba(253,250,245,0.92);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border-bottom: 1px solid rgba(168,213,181,0.25);
                    display: flex;
                    align-items: center;
                    padding: 0 28px;
                    gap: 20px;
                    position: sticky;
                    top: 0;
                    z-index: 500;
                    font-family: 'DM Sans', sans-serif;
                    box-shadow: 0 2px 12px rgba(26,58,42,0.06);
                }

                /* Brand */
                .gg-nb-brand {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                }
                .gg-nb-logo {
                    width: 28px; height: 28px;
                    background: linear-gradient(135deg, var(--forest), var(--moss));
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--mint);
                    font-size: 11px;
                    box-shadow: 0 2px 8px rgba(26,58,42,0.2);
                    flex-shrink: 0;
                }
                .gg-nb-brand-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--forest);
                    letter-spacing: -0.2px;
                }

                /* Divider */
                .gg-nb-sep {
                    width: 1px;
                    height: 20px;
                    background: rgba(168,213,181,0.3);
                    flex-shrink: 0;
                }

                /* Nav links */
                .gg-nb-links {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    flex: 1;
                }

                .gg-nb-link {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 400;
                    color: #5a8a6a;
                    transition: all 0.18s;
                }
                .gg-nb-link:hover {
                    background: rgba(168,213,181,0.15);
                    color: var(--forest);
                    text-decoration: none;
                }
                .gg-nb-link svg { font-size: 12px; opacity: 0.8; }

                .gg-nb-link.admin {
                    color: #8a6a1a;
                    background: rgba(201,168,76,0.08);
                    border: 1px solid rgba(201,168,76,0.2);
                }
                .gg-nb-link.admin:hover {
                    background: rgba(201,168,76,0.15);
                    color: #6a4e10;
                }

                /* Right section */
                .gg-nb-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-left: auto;
                }

                /* User pill */
                .gg-nb-user {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 5px 10px 5px 6px;
                    background: rgba(168,213,181,0.1);
                    border: 1px solid rgba(168,213,181,0.25);
                    border-radius: 20px;
                }
                .gg-nb-avatar {
                    width: 26px; height: 26px;
                    background: linear-gradient(135deg, var(--sage), var(--mint));
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 11px;
                    font-weight: 600;
                    color: var(--forest);
                    flex-shrink: 0;
                }
                .gg-nb-username {
                    font-size: 13px;
                    font-weight: 400;
                    color: var(--forest);
                    max-width: 140px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .gg-nb-role-badge {
                    font-size: 9px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    padding: 2px 6px;
                    border-radius: 4px;
                    background: rgba(45,90,61,0.1);
                    color: var(--moss);
                    border: 1px solid rgba(45,90,61,0.15);
                }
                .gg-nb-role-badge.admin {
                    background: rgba(201,168,76,0.12);
                    color: #8a6a1a;
                    border-color: rgba(201,168,76,0.25);
                }

                /* Logout button */
                .gg-nb-logout {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 7px 14px;
                    background: rgba(185,64,64,0.07);
                    border: 1px solid rgba(185,64,64,0.18);
                    border-radius: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    color: #b94040;
                    cursor: pointer;
                    transition: all 0.18s;
                }
                .gg-nb-logout:hover {
                    background: rgba(185,64,64,0.14);
                    border-color: rgba(185,64,64,0.28);
                    transform: translateY(-1px);
                }
                .gg-nb-logout svg { font-size: 11px; }

                /* Login link */
                .gg-nb-login {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 7px 16px;
                    background: linear-gradient(135deg, var(--forest), var(--moss));
                    color: var(--cream);
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.18s;
                    box-shadow: 0 2px 8px rgba(26,58,42,0.2);
                }
                .gg-nb-login:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 14px rgba(26,58,42,0.28);
                    color: var(--cream);
                    text-decoration: none;
                }
            `}</style>

            <nav className="gg-navbar">
                {/* Brand */}
                <Link to="/" className="gg-nb-brand">
                    <div className="gg-nb-logo"><FaBolt /></div>
                    <span className="gg-nb-brand-name">SGEMS</span>
                </Link>

                <div className="gg-nb-sep" />

                {/* Nav links */}
                <div className="gg-nb-links">
                    <Link to="/" className="gg-nb-link">
                        <FaTachometerAlt /> Dashboard
                    </Link>
                    {user?.role === 'ADMIN' && (
                        <Link to="/admin" className="gg-nb-link admin">
                            <FaUserShield /> Admin Panel
                        </Link>
                    )}
                </div>

                {/* Right section */}
                <div className="gg-nb-right">
                    {user ? (
                        <>
                            <div className="gg-nb-user">
                                <div className="gg-nb-avatar">
                                    {user.fullName?.charAt(0).toUpperCase()}
                                </div>
                                <span className="gg-nb-username">{user.fullName}</span>
                                <span className={`gg-nb-role-badge ${user.role === 'ADMIN' ? 'admin' : ''}`}>
                                    {user.role}
                                </span>
                            </div>
                            <button className="gg-nb-logout" onClick={handleLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="gg-nb-login">Login</Link>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Navbar;