import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaUserPlus, FaTrash, FaUserShield, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
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
    const [modalAction, setModalAction] = useState(null); // 'DELETE' or 'ROLE'
    const [selectedUser, setSelectedUser] = useState(null);

    // 1. Fetch Users
    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) setUsers(await res.json());
        } catch (error) { console.error(error); }
    };

    // 2. Add User (Matches the new /add backend endpoint)
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
    const confirmDelete = (user) => {
        setSelectedUser(user);
        setModalAction('DELETE');
        setShowModal(true);
    };

    const confirmRoleChange = (user) => {
        setSelectedUser(user);
        setModalAction('ROLE');
        setShowModal(true);
    };

    // --- EXECUTE ACTION (After clicking "Yes" in Modal) ---
    const executeAction = async () => {
        setShowModal(false); // Close Modal immediately

        if (modalAction === 'DELETE') {
            try {
                const res = await fetch(`/api/users/${selectedUser.id}`, { method: 'DELETE' });
                if(res.ok) {
                    setUsers(users.filter(u => u.id !== selectedUser.id));
                    toast.success("User deleted. 🗑️");
                } else toast.error("Delete failed.");
            } catch (e) { toast.error("Server Error."); }
        }

        else if (modalAction === 'ROLE') {
            const newRole = selectedUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
            try {
                const res = await fetch(`/api/users/${selectedUser.id}/role?role=${newRole}`, { method: 'PUT' });
                if(res.ok) {
                    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
                    toast.info(`Role updated to ${newRole} 🛡️`);
                } else toast.error("Update failed.");
            } catch (e) { toast.error("Server Error."); }
        }
    };

    return (
        <div className="container-fluid position-relative">
            <h2 className="mb-4 text-success">Admin User Management</h2>

            {/* ADD USER FORM */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-white fw-bold">
                    <FaUserPlus className="me-2 text-success"/> Add New User
                </div>
                <div className="card-body">
                    <form onSubmit={handleAddUser} className="row g-3">
                        <div className="col-md-3">
                            <input type="text" className="form-control" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
                        </div>
                        <div className="col-md-3">
                            <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="col-md-3">
                            <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div className="col-md-1">
                            <button className="btn btn-success w-100" disabled={loading}>{loading ? "..." : "Add"}</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* USER LIST */}
            <div className="card shadow-sm">
                <div className="card-header bg-white fw-bold"><FaUsers className="me-2 text-primary"/> System Users</div>
                <div className="card-body p-0">
                    <table className="table table-hover mb-0 vertical-align-middle">
                        <thead className="table-dark">
                        <tr>
                            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th className="text-end">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td className="fw-bold">{u.fullName}</td>
                                <td className="text-muted">{u.email}</td>
                                <td><span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>{u.role}</span></td>
                                <td className="text-end">
                                    <button onClick={() => confirmRoleChange(u)} className="btn btn-sm btn-warning me-2"><FaUserShield/> Change Role</button>
                                    <button onClick={() => confirmDelete(u)} className="btn btn-sm btn-danger me-2"><FaTrash/> Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- CUSTOM CONFIRMATION MODAL (Replaces Browser Popup) --- */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-warning text-dark">
                                <h5 className="modal-title"><FaExclamationTriangle className="me-2"/> Confirm Action</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to <strong>{modalAction === 'DELETE' ? 'DELETE' : 'CHANGE ROLE for'}</strong> user <strong>{selectedUser?.fullName}</strong>?</p>
                                <p className="text-muted small">This action cannot be undone immediately.</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-danger" onClick={executeAction}>Yes, Proceed</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminDashboard;