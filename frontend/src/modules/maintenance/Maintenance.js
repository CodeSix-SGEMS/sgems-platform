import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

function Maintenance() {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        status: 'PENDING'
    });

    useEffect(() => {
        if (user) fetchRequests();
    }, [user]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/maintenance?userId=${user.id}`);
            if (res.ok) setRequests(await res.json());
        } catch (err) {
            toast.error("Failed to load maintenance requests");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            toast.error("Title is required");
            return;
        }
        try {
            const url = editingId ? `/api/maintenance/${editingId}?userId=${user.id}` : `/api/maintenance?userId=${user.id}`;
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                toast.success(editingId ? "Request updated" : "Request created");
                setShowForm(false);
                setEditingId(null);
                setForm({ title: '', description: '', status: 'PENDING' });
                fetchRequests();
            } else {
                toast.error("Operation failed");
            }
        } catch (err) {
            toast.error("Server error");
        }
    };

    const handleEdit = (req) => {
        setEditingId(req.id);
        setForm({ title: req.title, description: req.description, status: req.status });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this maintenance request?")) return;
        try {
            const res = await fetch(`/api/maintenance/${id}?userId=${user.id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Deleted");
                fetchRequests();
            } else {
                toast.error("Delete failed");
            }
        } catch (err) {
            toast.error("Server error");
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'PENDING': return '#f0ad4e';
            case 'IN_PROGRESS': return '#5bc0de';
            case 'COMPLETED': return '#5cb85c';
            default: return '#777';
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ padding: '32px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Maintenance Management</h2>
                <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', description: '', status: 'PENDING' }); }}
                        style={{ background: '#2d5a3d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                    <FaPlus /> New Request
                </button>
            </div>

            {showForm && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h3>{editingId ? 'Edit Request' : 'New Maintenance Request'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '12px' }}>
                            <label>Title *</label>
                            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                                   style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label>Description</label>
                            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                                      style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label>Status</label>
                            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                                    style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="submit" style={{ background: '#2d5a3d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                                <FaSave /> {editingId ? 'Update' : 'Create'}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} style={{ background: '#ccc', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                                <FaTimes /> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <thead style={{ background: '#2d5a3d', color: '#fff' }}>
                <tr>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {requests.length === 0 ? (
                    <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>No maintenance requests</td></tr>
                ) : (
                    requests.map(req => (
                        <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>{req.title}</td>
                            <td style={{ padding: '12px' }}>{req.description || '—'}</td>
                            <td style={{ padding: '12px' }}>
                                    <span style={{ background: getStatusColor(req.status), color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>
                                        {req.status}
                                    </span>
                            </td>
                            <td style={{ padding: '12px' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                <button onClick={() => handleEdit(req)} style={{ marginRight: '8px', background: '#2196f3', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>
                                    <FaEdit /> Edit
                                </button>
                                <button onClick={() => handleDelete(req.id)} style={{ background: '#f44336', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>
                                    <FaTrash /> Delete
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Maintenance;