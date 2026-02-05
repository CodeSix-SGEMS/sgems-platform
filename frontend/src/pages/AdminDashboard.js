import React, { useState, useEffect } from 'react';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ fullName: '', email: '', password: '', role: 'USER' });

    // 1. Fetch Users on Load
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await fetch('http://localhost:8080/api/users');
        const data = await response.json();
        setUsers(data);
    };

    // 2. Handle Create User
    const handleCreate = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });

        if (response.ok) {
            alert("User Created!");
            setNewUser({ fullName: '', email: '', password: '', role: 'USER' }); // Reset form
            fetchUsers(); // Refresh table
        } else {
            alert("Error creating user");
        }
    };

    // 3. Handle Delete
    const handleDelete = async (id) => {
        if(window.confirm("Are you sure?")) {
            await fetch(`http://localhost:8080/api/users/${id}`, { method: 'DELETE' });
            fetchUsers();
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Admin User Management</h2>

            {/* Create User Form */}
            <div className="card p-4 mb-4 shadow-sm bg-light">
                <h5>Add New User</h5>
                <form onSubmit={handleCreate} className="row g-3">
                    <div className="col-md-3">
                        <input type="text" className="form-control" placeholder="Full Name"
                               value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} required />
                    </div>
                    <div className="col-md-3">
                        <input type="email" className="form-control" placeholder="Email"
                               value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
                    </div>
                    <div className="col-md-3">
                        <input type="password" className="form-control" placeholder="Password"
                               value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                    </div>
                    <div className="col-md-2">
                        <select className="form-select" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MANAGER">Manager</option>
                        </select>
                    </div>
                    <div className="col-md-1">
                        <button className="btn btn-success w-100">Add</button>
                    </div>
                </form>
            </div>

            {/* Users Table */}
            <table className="table table-hover table-bordered shadow-sm">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td><span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>{user.role}</span></td>
                        <td>
                            <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;