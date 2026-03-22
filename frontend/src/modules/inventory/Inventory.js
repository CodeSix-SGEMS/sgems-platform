import React, { useState, useEffect } from 'react';
import './Inventory.css';

const Inventory = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newAsset, setNewAsset] = useState({ name: '', category: '', location: '', serialNumber: '' });
    const [addLoading, setAddLoading] = useState(false);
    const [editAsset, setEditAsset] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteAsset, setDeleteAsset] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => { fetchAssets(); }, []);

    const fetchAssets = async () => {
        setLoading(true); setError(null);
        try {
            const res = await fetch('/api/inventory');
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setAssets(Array.isArray(data) ? data : []);
        } catch (err) { setError('Failed to load inventory. Is the backend running?'); }
        finally { setLoading(false); }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAsset({ ...newAsset, [name]: value });
    };

    const handleAddAsset = async (e) => {
        e.preventDefault();
        if (!newAsset.name || !newAsset.category || !newAsset.serialNumber) return;
        setAddLoading(true);
        try {
            const res = await fetch('/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newAsset, status: 'Available' })
            });
            if (!res.ok) { const msg = await res.text(); alert(msg || 'Failed to add asset.'); return; }
            const created = await res.json();
            setAssets([...assets, created]);
            setNewAsset({ name: '', category: '', location: '', serialNumber: '' });
        } catch (err) { alert('Failed to add asset. Please try again.'); }
        finally { setAddLoading(false); }
    };

    const openEdit = (asset) => setEditAsset({ ...asset });
    const handleEditChange = (e) => { const { name, value } = e.target; setEditAsset({ ...editAsset, [name]: value }); };

    const handleEditSave = async () => {
        if (!editAsset) return;
        setEditLoading(true);
        try {
            const res = await fetch(`/api/inventory/${editAsset.id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editAsset)
            });
            if (!res.ok) { const msg = await res.text(); alert(msg || 'Failed to update asset.'); return; }
            const updated = await res.json();
            setAssets(assets.map(a => a.id === updated.id ? updated : a));
            setEditAsset(null);
        } catch (err) { alert('Failed to update asset. Please try again.'); }
        finally { setEditLoading(false); }
    };

    const confirmDelete = (asset) => setDeleteAsset(asset);

    const handleDeleteConfirm = async () => {
        if (!deleteAsset) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/inventory/${deleteAsset.id}`, { method: 'DELETE' });
            if (!res.ok) { const msg = await res.text(); alert(msg); return; }
            setAssets(assets.filter(a => a.id !== deleteAsset.id));
            setDeleteAsset(null);
        } catch (err) { alert('Failed to delete asset. Please try again.'); }
        finally { setDeleteLoading(false); }
    };

    const statusColor = (status) => {
        switch (status) {
            case 'Available': return 'badge-blue';
            case 'In Use': return 'badge-gray';
            default: return 'badge-gray';
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-title">Inventory Management</h2>

            {/* ADD NEW ASSET */}
            <div className="card">
                <h3 className="card-title"><span className="icon">➕</span> Add New Asset</h3>
                <form className="add-form" onSubmit={handleAddAsset}>
                    <input type="text" name="name" placeholder="Asset Name (e.g., Solar Panel)"
                           value={newAsset.name} onChange={handleInputChange} required />
                    <input type="text" name="category" placeholder="Category (e.g., Energy)"
                           value={newAsset.category} onChange={handleInputChange} required />
                    <input type="text" name="location" placeholder="Location (e.g., Warehouse A)"
                           value={newAsset.location} onChange={handleInputChange} />
                    {/* ✅ Serial number required */}
                    <input type="text" name="serialNumber" placeholder="Serial Number (e.g., SN-1234)"
                           value={newAsset.serialNumber} onChange={handleInputChange} required />
                    <button type="submit" className="btn-add" disabled={addLoading}>
                        {addLoading ? 'Adding...' : 'Add'}
                    </button>
                </form>
                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 10, marginBottom: 0 }}>
                    ⚠️ Serial number must match the physical label on the device. Users will enter this to register their devices.
                </p>
            </div>

            {/* INVENTORY TABLE */}
            <div className="card">
                <h3 className="card-title">
                    <span className="icon">📦</span> System Inventory
                    {!loading && !error && (
                        <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 400, color: '#6b7280' }}>
                            {assets.length} {assets.length === 1 ? 'asset' : 'assets'}
                        </span>
                    )}
                </h3>

                {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading inventory...</div>}
                {error && (
                    <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#b91c1c', marginBottom: 16 }}>
                        {error}
                        <button onClick={fetchAssets} style={{ marginLeft: 12, background: '#b91c1c', color: 'white', padding: '4px 12px', fontSize: 12, border: 'none', borderRadius: 4, cursor: 'pointer' }}>Retry</button>
                    </div>
                )}

                {!loading && !error && (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Asset Name</th>
                            <th>Category</th>
                            <th>Location</th>
                            <th>Serial Number</th>{/* ✅ new column */}
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {assets.map((asset) => (
                            <tr key={asset.id}>
                                <td>{asset.id}</td>
                                <td className="font-bold">{asset.name}</td>
                                <td>{asset.category}</td>
                                <td>{asset.location || '—'}</td>
                                <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{asset.serialNumber}</td>
                                <td><span className={`badge ${statusColor(asset.status)}`}>{asset.status}</span></td>
                                <td className="actions-cell">
                                    <button className="btn-edit" onClick={() => openEdit(asset)}>✏️ Edit Item</button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => confirmDelete(asset)}
                                        disabled={asset.status === 'In Use'}
                                        title={asset.status === 'In Use' ? 'Cannot delete — device is actively registered' : ''}
                                        style={{ opacity: asset.status === 'In Use' ? 0.45 : 1, cursor: asset.status === 'In Use' ? 'not-allowed' : 'pointer' }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {assets.length === 0 && (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No assets found. Add your first asset above.</td></tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* EDIT MODAL */}
            {editAsset && (
                <div style={modalStyles.overlay} onClick={() => !editLoading && setEditAsset(null)}>
                    <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
                        <div style={modalStyles.header}>
                            <h3 style={modalStyles.title}>✏️ Edit Asset</h3>
                            <button style={modalStyles.closeBtn} onClick={() => setEditAsset(null)} disabled={editLoading}>✕</button>
                        </div>
                        <div style={modalStyles.body}>
                            {['name', 'category', 'location'].map(field => (
                                <div key={field} style={modalStyles.field}>
                                    <label style={modalStyles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input type="text" name={field} value={editAsset[field] || ''} onChange={handleEditChange} style={modalStyles.input} />
                                </div>
                            ))}
                            {/* ✅ Serial — disabled if In Use */}
                            <div style={modalStyles.field}>
                                <label style={modalStyles.label}>Serial Number</label>
                                <input type="text" name="serialNumber"
                                       value={editAsset.serialNumber || ''}
                                       onChange={handleEditChange}
                                       disabled={editAsset.status === 'In Use'}
                                       style={{ ...modalStyles.input, fontFamily: 'monospace', opacity: editAsset.status === 'In Use' ? 0.6 : 1 }}
                                />
                                {editAsset.status === 'In Use' && (
                                    <p style={{ fontSize: 11, color: '#b91c1c', margin: '4px 0 0' }}>
                                        Serial cannot be changed while device is actively registered.
                                    </p>
                                )}
                            </div>
                            <div style={modalStyles.field}>
                                <label style={modalStyles.label}>Status</label>
                                <select name="status" value={editAsset.status || 'Available'} onChange={handleEditChange} style={modalStyles.input}>
                                    <option value="Available">Available</option>
                                    <option value="In Use">In Use</option>
                                    <option value="Under Maintenance">Under Maintenance</option>
                                    <option value="Retired">Retired</option>
                                </select>
                            </div>
                        </div>
                        <div style={modalStyles.footer}>
                            <button style={modalStyles.cancelBtn} onClick={() => setEditAsset(null)} disabled={editLoading}>Cancel</button>
                            <button style={modalStyles.saveBtn} onClick={handleEditSave} disabled={editLoading}>{editLoading ? 'Saving...' : '💾 Save Changes'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {deleteAsset && (
                <div style={modalStyles.overlay} onClick={() => !deleteLoading && setDeleteAsset(null)}>
                    <div style={{ ...modalStyles.modal, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <div style={modalStyles.header}>
                            <h3 style={{ ...modalStyles.title, color: '#b91c1c' }}>🗑️ Confirm Delete</h3>
                            <button style={modalStyles.closeBtn} onClick={() => setDeleteAsset(null)} disabled={deleteLoading}>✕</button>
                        </div>
                        <div style={modalStyles.body}>
                            <p style={{ color: '#374151', marginBottom: 8 }}>Are you sure you want to delete <strong>{deleteAsset.name}</strong>?</p>
                            <p style={{ color: '#6b7280', fontSize: 13, fontFamily: 'monospace' }}>S/N: {deleteAsset.serialNumber}</p>
                            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 8 }}>This action cannot be undone.</p>
                        </div>
                        <div style={modalStyles.footer}>
                            <button style={modalStyles.cancelBtn} onClick={() => setDeleteAsset(null)} disabled={deleteLoading}>Cancel</button>
                            <button style={{ ...modalStyles.saveBtn, background: '#ef4444' }} onClick={handleDeleteConfirm} disabled={deleteLoading}>
                                {deleteLoading ? 'Deleting...' : '🗑️ Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const modalStyles = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modal: { background: '#fff', borderRadius: 10, width: '100%', maxWidth: 500, margin: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' },
    header: { padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    title: { margin: 0, fontSize: 16, fontWeight: 600, color: '#111827' },
    closeBtn: { background: 'none', border: 'none', fontSize: 18, color: '#6b7280', cursor: 'pointer', padding: '2px 4px' },
    body: { padding: '20px' },
    field: { marginBottom: 14 },
    label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' },
    input: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' },
    footer: { padding: '14px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: 10 },
    cancelBtn: { padding: '8px 18px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer' },
    saveBtn: { padding: '8px 18px', background: '#10b981', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer' },
};

export default Inventory;