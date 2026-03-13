import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaUserPlus, FaTrash, FaUserShield, FaUsers, FaExclamationTriangle, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [loading, setLoading] = useState(false);

    // --- MODAL STATE ---
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null); // 'DELETE', 'ROLE', or 'PASSWORD'
    const [selectedUser, setSelectedUser] = useState(null);

    // --- PASSWORD MODAL STATE ---
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);

    // 1. Fetch Users
    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) setUsers(await res.json());
        } catch (error) { console.error(error); }
    };

    // 2. Add User
    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/users/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password, role })
            });

            if (res.ok) {
                toast.success(`User ${fullName} created! 🎉`);
                setFullName(''); setEmail(''); setPassword('');
                fetchUsers();
            } else {
                const msg = await res.text();
                toast.error(msg || "Failed. Email might exist.");
            }
        } catch (error) {
            toast.error("Server Error.");
        } finally {
            setLoading(false);
        }
    };

    // --- MODAL TRIGGERS ---
    const confirmDelete = (u) => {
        setSelectedUser(u);
        setModalAction('DELETE');
        setShowModal(true);
    };

    const confirmRoleChange = (u) => {
        setSelectedUser(u);
        setModalAction('ROLE');
        setShowModal(true);
    };

    const confirmPasswordChange = (u) => {
        setSelectedUser(u);
        setNewPassword('');
        setShowNewPassword(false);
        setModalAction('PASSWORD');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setNewPassword('');
        setShowNewPassword(false);
    };

    // --- EXECUTE ACTION ---
    const executeAction = async () => {
        setShowModal(false);

        if (modalAction === 'DELETE') {
            try {
                const res = await fetch(`/api/users/${selectedUser.id}`, { method: 'DELETE' });
                if (res.ok) {
                    setUsers(users.filter(u => u.id !== selectedUser.id));
                    toast.success("User deleted. 🗑️");
                } else toast.error("Delete failed.");
            } catch (e) { toast.error("Server Error."); }
        }

        else if (modalAction === 'ROLE') {
            const newRole = selectedUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
            try {
                const res = await fetch(`/api/users/${selectedUser.id}/role?role=${newRole}`, { method: 'PUT' });
                if (res.ok) {
                    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
                    toast.info(`Role updated to ${newRole} 🛡️`);
                } else toast.error("Update failed.");
            } catch (e) { toast.error("Server Error."); }
        }
    };

    // --- CHANGE PASSWORD (separate handler — needs validation) ---
    const executePasswordChange = async () => {
        if (!newPassword || newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        setPwLoading(true);
        try {
            const res = await fetch(`/api/users/${selectedUser.id}/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword })
            });
            if (res.ok) {
                toast.success(`Password updated for ${selectedUser.fullName}. 🔑`);
                closeModal();
            } else {
                const msg = await res.text();
                toast.error(msg || "Password update failed.");
            }
        } catch (e) {
            toast.error("Server Error.");
        } finally {
            setPwLoading(false);
        }
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

            .gg-admin { font-family: 'DM Sans', sans-serif; }

            .gg-admin-title {
                font-family: 'Playfair Display', serif;
                font-size: 28px;
                font-weight: 700;
                color: var(--forest);
                letter-spacing: -0.5px;
                margin-bottom: 24px;
            }

            /* Cards */
            .gg-admin-card {
                background: rgba(255,255,255,0.88);
                border: 1px solid rgba(168,213,181,0.3);
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(26,58,42,0.07);
                margin-bottom: 22px;
            }

            .gg-admin-card-header {
                padding: 14px 20px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13.5px;
                font-weight: 500;
                color: var(--forest);
                background: rgba(245,240,232,0.5);
                border-bottom: 1px solid rgba(168,213,181,0.2);
            }
            .gg-admin-card-header svg { color: var(--moss); }

            .gg-admin-card-body { padding: 20px; }

            /* Add user form inputs */
            .gg-form-row {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 160px 80px;
                gap: 12px;
                align-items: center;
            }
            @media (max-width: 1100px) { .gg-form-row { grid-template-columns: 1fr 1fr; } }

            .gg-input {
                width: 100%;
                padding: 10px 14px;
                font-family: 'DM Sans', sans-serif;
                font-size: 13.5px;
                color: var(--forest);
                background: rgba(245,240,232,0.6);
                border: 1.5px solid rgba(90,138,106,0.22);
                border-radius: 10px;
                outline: none;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            .gg-input:focus {
                border-color: var(--moss);
                background: #fff;
                box-shadow: 0 0 0 3px rgba(90,138,106,0.1);
            }
            .gg-input::placeholder { color: #b0c4b8; }

            .gg-select {
                width: 100%;
                padding: 10px 14px;
                font-family: 'DM Sans', sans-serif;
                font-size: 13.5px;
                color: var(--forest);
                background: rgba(245,240,232,0.6);
                border: 1.5px solid rgba(90,138,106,0.22);
                border-radius: 10px;
                outline: none;
                cursor: pointer;
                transition: border-color 0.2s;
            }
            .gg-select:focus { border-color: var(--moss); }

            .gg-btn-add {
                padding: 10px 14px;
                background: linear-gradient(135deg, var(--forest), var(--moss));
                color: var(--cream);
                border: none;
                border-radius: 10px;
                font-family: 'DM Sans', sans-serif;
                font-size: 13.5px;
                font-weight: 500;
                cursor: pointer;
                transition: transform 0.18s, box-shadow 0.18s;
                box-shadow: 0 3px 12px rgba(26,58,42,0.22);
                white-space: nowrap;
            }
            .gg-btn-add:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(26,58,42,0.28); }
            .gg-btn-add:disabled { opacity: 0.6; cursor: not-allowed; }

            /* Table */
            .gg-table { width: 100%; border-collapse: collapse; }
            .gg-table thead tr {
                background: var(--forest);
            }
            .gg-table thead th {
                padding: 12px 16px;
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                color: rgba(168,213,181,0.7);
                text-align: left;
            }
            .gg-table thead th:last-child { text-align: right; }

            .gg-table tbody tr {
                border-bottom: 1px solid rgba(168,213,181,0.15);
                transition: background 0.15s;
            }
            .gg-table tbody tr:last-child { border-bottom: none; }
            .gg-table tbody tr:hover { background: rgba(168,213,181,0.06); }

            .gg-table td {
                padding: 13px 16px;
                font-size: 13.5px;
                color: #3a5a48;
                vertical-align: middle;
            }

            .gg-td-id { color: #9ab5a5; font-size: 12px; }
            .gg-td-name { font-weight: 500; color: var(--forest); }
            .gg-td-email { color: #7a9688; }

            .gg-badge {
                display: inline-block;
                padding: 3px 10px;
                border-radius: 6px;
                font-size: 10.5px;
                font-weight: 600;
                letter-spacing: 0.8px;
                text-transform: uppercase;
            }
            .gg-badge-admin { background: rgba(185,64,64,0.12); color: #9a3030; border: 1px solid rgba(185,64,64,0.2); }
            .gg-badge-user  { background: rgba(45,90,61,0.1);  color: var(--moss); border: 1px solid rgba(45,90,61,0.18); }

            .gg-actions { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap; }

            /* Action buttons */
            .gg-btn-action {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 6px 11px;
                border: none;
                border-radius: 8px;
                font-family: 'DM Sans', sans-serif;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.18s;
                white-space: nowrap;
            }
            .gg-btn-role {
                background: rgba(201,168,76,0.12);
                color: #8a6a1a;
                border: 1px solid rgba(201,168,76,0.3);
            }
            .gg-btn-role:hover { background: rgba(201,168,76,0.22); transform: translateY(-1px); }

            .gg-btn-password {
                background: rgba(45,90,61,0.1);
                color: var(--moss);
                border: 1px solid rgba(45,90,61,0.2);
            }
            .gg-btn-password:hover { background: rgba(45,90,61,0.18); transform: translateY(-1px); }

            .gg-btn-delete {
                background: rgba(185,64,64,0.08);
                color: #9a3030;
                border: 1px solid rgba(185,64,64,0.2);
            }
            .gg-btn-delete:hover { background: rgba(185,64,64,0.16); transform: translateY(-1px); }

            /* Modal overlay */
            .gg-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(10,25,16,0.55);
                backdrop-filter: blur(4px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: overlayIn 0.2s ease;
            }
            @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }

            .gg-modal {
                background: var(--warm-white);
                border: 1px solid rgba(168,213,181,0.35);
                border-radius: 20px;
                width: 100%;
                max-width: 420px;
                margin: 20px;
                box-shadow: 0 32px 80px rgba(10,25,16,0.25);
                animation: modalIn 0.25s cubic-bezier(.22,1,.36,1);
                overflow: hidden;
            }
            @keyframes modalIn {
                from { opacity: 0; transform: translateY(20px) scale(0.97); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
            }

            .gg-modal-header {
                padding: 20px 24px 16px;
                display: flex;
                align-items: center;
                gap: 10px;
                border-bottom: 1px solid rgba(168,213,181,0.2);
            }
            .gg-modal-header-icon {
                width: 36px; height: 36px;
                border-radius: 10px;
                display: flex; align-items: center; justify-content: center;
                font-size: 15px;
                flex-shrink: 0;
            }
            .gg-modal-header-icon.warn  { background: rgba(201,168,76,0.15); color: #8a6a1a; }
            .gg-modal-header-icon.danger { background: rgba(185,64,64,0.12); color: #9a3030; }
            .gg-modal-header-icon.key   { background: rgba(45,90,61,0.12);  color: var(--moss); }

            .gg-modal-title {
                font-family: 'Playfair Display', serif;
                font-size: 18px;
                font-weight: 700;
                color: var(--forest);
                margin: 0;
            }

            .gg-modal-close {
                margin-left: auto;
                background: none;
                border: none;
                font-size: 18px;
                color: #9ab5a5;
                cursor: pointer;
                line-height: 1;
                padding: 2px 4px;
                transition: color 0.2s;
            }
            .gg-modal-close:hover { color: var(--forest); }

            .gg-modal-body { padding: 20px 24px; }

            .gg-modal-body p {
                font-size: 14px;
                color: #4a6356;
                line-height: 1.6;
                margin: 0 0 8px;
            }
            .gg-modal-body p strong { color: var(--forest); }
            .gg-modal-hint {
                font-size: 12px !important;
                color: #9ab5a5 !important;
            }

            /* Password input wrapper inside modal */
            .gg-pw-wrap {
                position: relative;
                margin-top: 16px;
            }
            .gg-pw-input {
                width: 100%;
                padding: 11px 42px 11px 14px;
                font-family: 'DM Sans', sans-serif;
                font-size: 14px;
                color: var(--forest);
                background: rgba(245,240,232,0.7);
                border: 1.5px solid rgba(90,138,106,0.25);
                border-radius: 10px;
                outline: none;
                transition: border-color 0.2s, box-shadow 0.2s;
                box-sizing: border-box;
            }
            .gg-pw-input:focus {
                border-color: var(--moss);
                background: #fff;
                box-shadow: 0 0 0 3px rgba(90,138,106,0.1);
            }
            .gg-pw-input::placeholder { color: #b0c4b8; }
            .gg-pw-eye {
                position: absolute;
                right: 12px; top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                color: #8ab09a;
                display: flex; align-items: center;
                padding: 0;
                transition: color 0.2s;
            }
            .gg-pw-eye:hover { color: var(--moss); }

            .gg-modal-footer {
                padding: 14px 24px 20px;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                border-top: 1px solid rgba(168,213,181,0.15);
            }

            .gg-btn-cancel {
                padding: 9px 18px;
                background: rgba(168,213,181,0.12);
                border: 1px solid rgba(168,213,181,0.3);
                border-radius: 9px;
                font-family: 'DM Sans', sans-serif;
                font-size: 13.5px;
                font-weight: 500;
                color: var(--sage);
                cursor: pointer;
                transition: all 0.18s;
            }
            .gg-btn-cancel:hover { background: rgba(168,213,181,0.22); color: var(--forest); }

            .gg-btn-confirm {
                padding: 9px 20px;
                border: none;
                border-radius: 9px;
                font-family: 'DM Sans', sans-serif;
                font-size: 13.5px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.18s;
                box-shadow: 0 3px 10px rgba(0,0,0,0.12);
            }
            .gg-btn-confirm:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(0,0,0,0.16); }
            .gg-btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
            .gg-btn-confirm.danger { background: linear-gradient(135deg, #b94040, #d05050); color: #fff; }
            .gg-btn-confirm.forest { background: linear-gradient(135deg, var(--forest), var(--moss)); color: var(--cream); }
        `}</style>

            <div className="gg-admin">
                <h2 className="gg-admin-title">User Management</h2>

                {/* ADD USER FORM */}
                <div className="gg-admin-card">
                    <div className="gg-admin-card-header">
                        <FaUserPlus /> Add New User
                    </div>
                    <div className="gg-admin-card-body">
                        <form onSubmit={handleAddUser}>
                            <div className="gg-form-row">
                                <input type="text" className="gg-input" placeholder="Full Name"
                                       value={fullName} onChange={e => setFullName(e.target.value)} required />
                                <input type="email" className="gg-input" placeholder="Email"
                                       value={email} onChange={e => setEmail(e.target.value)} required />
                                <input type="password" className="gg-input" placeholder="Password"
                                       value={password} onChange={e => setPassword(e.target.value)} required />
                                <select className="gg-select" value={role} onChange={e => setRole(e.target.value)}>
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                                <button type="submit" className="gg-btn-add" disabled={loading}>
                                    {loading ? "Adding…" : "Add User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* USER LIST */}
                <div className="gg-admin-card">
                    <div className="gg-admin-card-header">
                        <FaUsers /> System Users
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#9ab5a5' }}>
                        {users.length} {users.length === 1 ? 'user' : 'users'}
                    </span>
                    </div>
                    <table className="gg-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td className="gg-td-id">#{u.id}</td>
                                <td className="gg-td-name">{u.fullName}</td>
                                <td className="gg-td-email">{u.email}</td>
                                <td>
                                    <span className={`gg-badge ${u.role === 'ADMIN' ? 'gg-badge-admin' : 'gg-badge-user'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>
                                    <div className="gg-actions">
                                        <button className="gg-btn-action gg-btn-role" onClick={() => confirmRoleChange(u)}>
                                            <FaUserShield /> Change Role
                                        </button>
                                        <button className="gg-btn-action gg-btn-password" onClick={() => confirmPasswordChange(u)}>
                                            <FaKey /> Change Password
                                        </button>
                                        <button className="gg-btn-action gg-btn-delete" onClick={() => confirmDelete(u)}>
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODAL ── */}
            {showModal && (
                <div className="gg-modal-overlay" onClick={closeModal}>
                    <div className="gg-modal" onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="gg-modal-header">
                            <div className={`gg-modal-header-icon ${modalAction === 'DELETE' ? 'danger' : modalAction === 'PASSWORD' ? 'key' : 'warn'}`}>
                                {modalAction === 'DELETE'   && <FaExclamationTriangle />}
                                {modalAction === 'ROLE'     && <FaUserShield />}
                                {modalAction === 'PASSWORD' && <FaKey />}
                            </div>
                            <h5 className="gg-modal-title">
                                {modalAction === 'DELETE'   && 'Delete User'}
                                {modalAction === 'ROLE'     && 'Change Role'}
                                {modalAction === 'PASSWORD' && 'Change Password'}
                            </h5>
                            <button className="gg-modal-close" onClick={closeModal}>✕</button>
                        </div>

                        {/* Body */}
                        <div className="gg-modal-body">
                            {modalAction === 'DELETE' && (
                                <>
                                    <p>Are you sure you want to <strong>permanently delete</strong> user <strong>{selectedUser?.fullName}</strong>?</p>
                                    <p className="gg-modal-hint">This action cannot be undone.</p>
                                </>
                            )}
                            {modalAction === 'ROLE' && (
                                <>
                                    <p>Change role for <strong>{selectedUser?.fullName}</strong> from <strong>{selectedUser?.role}</strong> to <strong>{selectedUser?.role === 'ADMIN' ? 'USER' : 'ADMIN'}</strong>?</p>
                                    <p className="gg-modal-hint">The user will get different permissions immediately.</p>
                                </>
                            )}
                            {modalAction === 'PASSWORD' && (
                                <>
                                    <p>Set a new password for <strong>{selectedUser?.fullName}</strong>.</p>
                                    <p className="gg-modal-hint">Minimum 6 characters. The user should be notified.</p>
                                    <div className="gg-pw-wrap">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            className="gg-pw-input"
                                            placeholder="Enter new password…"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            className="gg-pw-eye"
                                            onClick={() => setShowNewPassword(v => !v)}
                                            tabIndex={-1}
                                        >
                                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="gg-modal-footer">
                            <button className="gg-btn-cancel" onClick={closeModal}>Cancel</button>

                            {modalAction === 'PASSWORD' ? (
                                <button
                                    className="gg-btn-confirm forest"
                                    onClick={executePasswordChange}
                                    disabled={pwLoading || newPassword.length < 6}
                                >
                                    {pwLoading ? 'Saving…' : 'Update Password'}
                                </button>
                            ) : (
                                <button
                                    className={`gg-btn-confirm ${modalAction === 'DELETE' ? 'danger' : 'forest'}`}
                                    onClick={executeAction}
                                >
                                    {modalAction === 'DELETE' ? 'Yes, Delete' : 'Yes, Change Role'}
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

export default AdminDashboard;