import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/* ─── Inline styles ─────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@400;500&display=swap');

  .sg-settings * { box-sizing: border-box; margin: 0; padding: 0; }

  .sg-settings {
    font-family: 'DM Sans', sans-serif;
    color: #1a1a1a;
    padding: 2rem 1.5rem 3rem;
    max-width: 780px;
    margin: 0 auto;
  }

  /* Page header */
  .sg-page-header {
    display: flex;
    align-items: flex-end;
    gap: 14px;
    margin-bottom: 2rem;
  }
  .sg-page-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: #e8f5ee;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .sg-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.2;
    margin-bottom: 3px;
  }
  .sg-page-subtitle {
    font-size: 13px;
    color: #6b7280;
  }

  /* Section label */
  .sg-section-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 10px;
    padding: 0 2px;
  }

  /* Card */
  .sg-card {
    background: #fff;
    border: 0.5px solid rgba(0,0,0,0.1);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  /* Profile card */
  .sg-profile-card {
    background: #fff;
    border: 0.5px solid rgba(0,0,0,0.1);
    border-radius: 12px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 1.5rem;
  }
  .sg-avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #2d7a4f;
    color: #fff;
    font-size: 20px;
    font-weight: 500;
    font-family: 'Playfair Display', serif;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .sg-profile-name {
    font-size: 15px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 2px;
  }
  .sg-profile-email {
    font-size: 13px;
    color: #6b7280;
  }
  .sg-profile-tag {
    margin-left: auto;
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 20px;
    background: #e8f5ee;
    color: #1a6637;
  }

  /* Setting row */
  .sg-setting-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    border-bottom: 0.5px solid rgba(0,0,0,0.07);
    cursor: pointer;
    transition: background 0.15s;
    user-select: none;
  }
  .sg-setting-row:last-child { border-bottom: none; }
  .sg-setting-row:hover { background: #f9fafb; }
  .sg-setting-row.disabled { cursor: default; }
  .sg-setting-row.disabled:hover { background: transparent; }

  .sg-setting-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .sg-setting-icon.green { background: #e8f5ee; }
  .sg-setting-icon.amber { background: #fdf3e0; }
  .sg-setting-icon.blue  { background: #e6f1fb; }
  .sg-setting-icon.coral { background: #faece7; }

  .sg-setting-body { flex: 1; min-width: 0; }
  .sg-setting-name {
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 2px;
  }
  .sg-setting-desc {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
  }

  /* Toggle switch */
  .sg-toggle {
    position: relative;
    width: 42px;
    height: 24px;
    flex-shrink: 0;
  }
  .sg-toggle input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }
  .sg-toggle-track {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: #d1d5db;
    transition: background 0.2s;
    cursor: pointer;
  }
  .sg-toggle-track.on { background: #2d7a4f; }
  .sg-toggle-thumb {
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    top: 3px;
    left: 3px;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.18);
    pointer-events: none;
  }
  .sg-toggle-thumb.on { transform: translateX(18px); }

  /* Badge */
  .sg-badge {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 9px;
    border-radius: 20px;
    flex-shrink: 0;
  }
  .sg-badge.coming { background: #fdf3e0; color: #7a5210; }
  .sg-badge.new    { background: #e8f5ee; color: #1a6637; }

  /* Divider */
  .sg-divider {
    height: 0.5px;
    background: rgba(0,0,0,0.08);
    margin: 0.25rem 0 1.5rem;
  }

  /* Danger / logout button */
  .sg-danger-btn {
    width: 100%;
    padding: 13px;
    border-radius: 8px;
    border: 0.5px solid rgba(0,0,0,0.1);
    background: #fff;
    color: #b03030;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.15s, border-color 0.15s;
  }
  .sg-danger-btn:hover { background: #fcebeb; border-color: #e24b4a; }

  /* Toast */
  .sg-toast {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: #1a3d28;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    padding: 10px 18px;
    border-radius: 20px;
    opacity: 0;
    transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), opacity 0.25s;
    pointer-events: none;
    white-space: nowrap;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .sg-toast.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
`;

/* ─── SVG icons ──────────────────────────────────────────────────────── */
const IconGear = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d7a4f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
);

const IconMail = ({ color = '#2d7a4f' }) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>
);

const IconBell = ({ color = '#b07a10' }) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
);

const IconSun = ({ color = '#185fa5' }) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
);

const IconLayout = ({ color = '#993c1d' }) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
);

const IconLogout = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

const IconCheck = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6fcf97" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);

/* ─── Toggle component ───────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
    return (
        <div className="sg-toggle" onClick={e => { e.stopPropagation(); onChange(!checked); }}>
            <div className={`sg-toggle-track ${checked ? 'on' : ''}`} />
            <div className={`sg-toggle-thumb ${checked ? 'on' : ''}`} />
        </div>
    );
}

/* ─── Setting row component ──────────────────────────────────────────── */
function SettingRow({ icon, iconColor, label, description, right, onClick }) {
    return (
        <div
            className={`sg-setting-row${onClick ? '' : ' disabled'}`}
            onClick={onClick}
        >
            <div className={`sg-setting-icon ${iconColor}`}>
                {icon}
            </div>
            <div className="sg-setting-body">
                <p className="sg-setting-name">{label}</p>
                <p className="sg-setting-desc">{description}</p>
            </div>
            {right}
        </div>
    );
}

/* ─── Main Settings component ────────────────────────────────────────── */
export default function Settings() {
    const { user, updateUser, logout } = useContext(AuthContext);

    const [emailNotify, setEmailNotify] = useState(user?.emailNotifications === true);
    const [pushNotify, setPushNotify]   = useState(false);
    const [toast, setToast]             = useState({ visible: false, message: '' });
    const navigate = useNavigate();

    /* Inject styles once */
    useEffect(() => {
        const id = 'sgems-settings-styles';
        if (!document.getElementById(id)) {
            const el = document.createElement('style');
            el.id = id;
            el.textContent = styles;
            document.head.appendChild(el);
        }
    }, []);

    /* Toast helper */
    const showToast = (message) => {
        setToast({ visible: true, message });
        setTimeout(() => setToast({ visible: false, message: '' }), 2400);
    };

    /* Email notifications */
    const handleEmailToggle = async (newValue) => {
        setEmailNotify(newValue);
        try {
            await fetch(`/api/users/${user.id}/email-notifications?enabled=${newValue}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });
            updateUser({ ...user, emailNotifications: newValue });
            showToast(`Email notifications ${newValue ? 'enabled' : 'disabled'}`);
        } catch {
            setEmailNotify(!newValue);
            showToast('Failed to save. Please try again.');
        }
    };

    /* Push notifications (placeholder) */
    const handlePushToggle = (newValue) => {
        setPushNotify(newValue);
        showToast(`Push notifications ${newValue ? 'enabled' : 'disabled'}`);
    };

    /* Avatar initials */
    const initials = user?.name
        ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    return (
        <div className="sg-settings">

            {/* Page header */}
            <div className="sg-page-header">
                <div className="sg-page-icon"><IconGear /></div>
                <div>
                    <p className="sg-page-title">Settings</p>
                    <p className="sg-page-subtitle">Manage your preferences and account</p>
                </div>
            </div>

            {/* Account */}
            <p className="sg-section-label">Your account</p>
            <div className="sg-profile-card">
                <div className="sg-avatar">{initials}</div>
                <div>
                    <p className="sg-profile-name">{user?.name || 'User'}</p>
                    <p className="sg-profile-email">{user?.email || ''}</p>
                </div>
                <span className="sg-profile-tag">
          {user?.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : 'User'}
        </span>
            </div>

            {/* Notifications */}
            <p className="sg-section-label">Notifications</p>
            <div className="sg-card">
                <SettingRow
                    icon={<IconMail />}
                    iconColor="green"
                    label="Email notifications"
                    description="Get an email whenever a new system alert is triggered at your site."
                    right={<Toggle checked={emailNotify} onChange={handleEmailToggle} />}
                    onClick={() => handleEmailToggle(!emailNotify)}
                />
                <SettingRow
                    icon={<IconBell />}
                    iconColor="amber"
                    label="Push notifications"
                    description="Receive real-time alerts in your browser for critical energy events."
                    right={<Toggle checked={pushNotify} onChange={handlePushToggle} />}
                    onClick={() => handlePushToggle(!pushNotify)}
                />
            </div>

            {/* Display */}
            <p className="sg-section-label">Display</p>
            <div className="sg-card">
                <SettingRow
                    icon={<IconSun />}
                    iconColor="blue"
                    label="Energy units"
                    description="Display readings in kWh (kilowatt-hours) across all dashboards."
                    right={<span className="sg-badge coming">kWh</span>}
                />
                <SettingRow
                    icon={<IconLayout />}
                    iconColor="coral"
                    label="Dashboard layout"
                    description="Customise which widgets appear on your main dashboard view."
                    right={<span className="sg-badge coming">Soon</span>}
                />
            </div>

            <div className="sg-divider" />

            {/* Logout */}
            <button className="sg-danger-btn" onClick={() => {
                logout();
                navigate('/login');
            }}>
                <IconLogout />
                Sign out of SGEMS
            </button>

            {/* Toast */}
            <div className={`sg-toast${toast.visible ? ' show' : ''}`}>
                <IconCheck />
                {toast.message}
            </div>

        </div>
    );
}