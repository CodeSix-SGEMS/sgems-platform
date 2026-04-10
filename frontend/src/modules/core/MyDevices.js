import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
    FaSolarPanel, FaBolt, FaTrash, FaPlus, FaCheckCircle,
    FaTimesCircle, FaBatteryFull, FaTachometerAlt, FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

function MyDevices() {
    const { user } = useContext(AuthContext);
    const [devices, setDevices] = useState([]);

    // Form state — no dropdown, just name + serial
    const [name, setName] = useState('');
    const [serial, setSerial] = useState('');
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState('');

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (user) fetchDevices();
    }, [user]);

    const fetchDevices = () => {
        fetch(`/api/devices/my-devices/${user.id}`)
            .then(res => { if (!res.ok) throw new Error("API Error"); return res.json(); })
            .then(data => {
                if (Array.isArray(data)) setDevices(data);
                else { setDevices([]); toast.error("Received invalid data from server."); }
            })
            .catch(err => { console.error(err); setDevices([]); });
    };

    // Add Device — backend validates serial against inventory
    const handleAddDevice = async (e) => {
        e.preventDefault();
        if (!name || !serial) {
            toast.warning("Please fill in all fields!");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`/api/devices/add?userId=${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, serialNumber: serial, status: "ONLINE" })
            });

            if (response.ok) {
                const newDevice = await response.json();
                setDevices([...devices, newDevice]);
                setName(''); setSerial('');
                toast.success("Device registered successfully! 🚀");
            } else {
                // ✅ Show the specific error message from backend
                const errMsg = await response.text();
                toast.error(errMsg || "Failed to register device.");
            }
        } catch (error) {
            toast.error("Server Error: Could not add device.");
        } finally {
            setLoading(false);
        }
    };

    // Toggle Status
    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
        try {
            await fetch(`/api/devices/${id}/status?status=${newStatus}`, { method: 'PUT' });
            setDevices(devices.map(d => d.id === id ? { ...d, status: newStatus } : d));
            if (newStatus === 'ONLINE') toast.info("Device is back Online 🟢");
            else toast.warn("Device is now Offline 🔴");
        } catch (error) { toast.error("Failed to update status."); }
    };

    // Delete modal
    const confirmDelete = (device) => { setDeviceToDelete(device); setShowDeleteModal(true); };
    const closeDeleteModal = () => { if (deleteLoading) return; setShowDeleteModal(false); setDeviceToDelete(null); };

    const executeDelete = async () => {
        if (!deviceToDelete) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/devices/${deviceToDelete.id}`, { method: 'DELETE' });
            if (res.ok) {
                setDevices(devices.filter(d => d.id !== deviceToDelete.id));
                toast.success("Device removed. Inventory restored. ✅");
                setShowDeleteModal(false);
                setDeviceToDelete(null);
            } else {
                const errMsg = await res.text();
                toast.error(errMsg || "Failed to delete device.");
            }
        } catch (error) { toast.error("Failed to delete device."); }
        finally { setDeleteLoading(false); }
    };

    const normalizeType = (type) => {
        if (!type) return 'Solar Panel';
        const map = { 'SOLAR_PANEL': 'Solar Panel', 'INVERTER': 'Inverter', 'BATTERY': 'Battery', 'SMART_METER': 'Smart Meter' };
        return map[type] || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const getDeviceIcon = (type) => {
        switch (normalizeType(type)) {
            case 'Solar Panel': return <FaSolarPanel />;
            case 'Inverter':    return <FaBolt />;
            case 'Battery':     return <FaBatteryFull />;
            case 'Smart Meter': return <FaTachometerAlt />;
            default:            return <FaSolarPanel />;
        }
    };

    const getDeviceAccent = (type) => {
        switch (normalizeType(type)) {
            case 'Solar Panel': return { bg: 'rgba(201,168,76,0.12)',  color: '#c9a84c', border: 'rgba(201,168,76,0.25)' };
            case 'Inverter':    return { bg: 'rgba(45,90,61,0.12)',    color: '#2d5a3d', border: 'rgba(45,90,61,0.25)' };
            case 'Battery':     return { bg: 'rgba(59,122,191,0.12)',  color: '#3b7abf', border: 'rgba(59,122,191,0.25)' };
            case 'Smart Meter': return { bg: 'rgba(90,138,106,0.12)',  color: '#5a8a6a', border: 'rgba(90,138,106,0.25)' };
            default:            return { bg: 'rgba(168,213,181,0.12)', color: '#5a8a6a', border: 'rgba(168,213,181,0.3)' };
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');
                :root { --forest:#1a3a2a; --moss:#2d5a3d; --sage:#5a8a6a; --mint:#a8d5b5; --cream:#f5f0e8; --warm-white:#fdfaf5; --gold:#c9a84c; }
                .gg-devices { font-family:'DM Sans',sans-serif; padding:32px 36px; min-height:100vh; background:var(--warm-white); position:relative; }
                .gg-dv-blob { position:fixed; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:0; }
                .gg-dv-blob-1 { width:450px; height:450px; background:radial-gradient(circle,rgba(168,213,181,0.16) 0%,transparent 70%); top:-100px; right:0; }
                .gg-dv-blob-2 { width:300px; height:300px; background:radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 70%); bottom:100px; left:20%; }
                .gg-dv-content { position:relative; z-index:1; }
                .gg-dv-eyebrow { font-size:10.5px; font-weight:500; letter-spacing:2.5px; text-transform:uppercase; color:var(--sage); margin-bottom:6px; display:flex; align-items:center; gap:8px; }
                .gg-dv-eyebrow::before { content:''; display:inline-block; width:18px; height:2px; background:var(--gold); border-radius:2px; }
                .gg-dv-h1 { font-family:'Playfair Display',serif; font-size:clamp(26px,3vw,36px); font-weight:700; color:var(--forest); letter-spacing:-0.5px; margin:0 0 6px; line-height:1.15; }
                .gg-dv-sub { font-size:14px; font-weight:300; color:#6a8a78; margin:0 0 32px; }
                .gg-dv-layout { display:grid; grid-template-columns:1fr 340px; gap:24px; align-items:start; }
                @media (max-width:1000px) { .gg-dv-layout { grid-template-columns:1fr; } }
                .gg-dv-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
                .gg-dv-empty { grid-column:1/-1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:64px 24px; background:rgba(255,255,255,0.7); border:1.5px dashed rgba(168,213,181,0.4); border-radius:18px; color:#9ab5a5; text-align:center; }
                .gg-dv-empty-icon { font-size:40px; color:rgba(168,213,181,0.5); margin-bottom:16px; }
                .gg-dv-empty h5 { font-family:'Playfair Display',serif; font-size:18px; color:var(--sage); margin-bottom:6px; }
                .gg-dv-empty p { font-size:13px; font-weight:300; margin:0; }
                .gg-dv-card { background:rgba(255,255,255,0.88); border:1px solid rgba(168,213,181,0.28); border-radius:16px; padding:20px; box-shadow:0 4px 16px rgba(26,58,42,0.07); transition:transform 0.22s,box-shadow 0.22s; animation:dvCardIn 0.45s cubic-bezier(.22,1,.36,1) both; position:relative; overflow:hidden; }
                .gg-dv-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:16px 16px 0 0; }
                .gg-dv-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(26,58,42,0.12); }
                @keyframes dvCardIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                .gg-dv-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; }
                .gg-dv-icon-wrap { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
               .gg-dv-delete {
                width: 36px; height: 36px;
                border-radius: 8px;
                background: rgba(185,64,64,0.1);
                border: 1px solid rgba(185,64,64,0.25);
                color: #c0392b;
                display: flex; align-items: center; justify-content: center;
                font-size: 15px;
                cursor: pointer;
                transition: all 0.18s;
                flex-shrink: 0;
                line-height: 1;
                padding: 0;
                }
                .gg-dv-delete:hover { background:rgba(185,64,64,0.14); transform:scale(1.08); }
                .gg-dv-name { font-size:15px; font-weight:500; color:var(--forest); margin-bottom:3px; }
                .gg-dv-serial { font-size:11.5px; color:#9ab5a5; font-weight:400; margin-bottom:14px; letter-spacing:0.5px; }
                .gg-dv-type-tag { display:inline-block; font-size:10px; font-weight:500; letter-spacing:0.8px; text-transform:uppercase; padding:2px 8px; border-radius:5px; margin-bottom:14px; }
                .gg-dv-status { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:8px; font-size:12px; font-weight:500; cursor:pointer; border:none; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
                .gg-dv-status.online { background:rgba(45,90,61,0.1); color:var(--moss); border:1px solid rgba(45,90,61,0.2); }
                .gg-dv-status.online:hover { background:rgba(45,90,61,0.18); }
                .gg-dv-status.offline { background:rgba(155,155,155,0.1); color:#888; border:1px solid rgba(155,155,155,0.2); }
                .gg-dv-status.offline:hover { background:rgba(155,155,155,0.18); }
                .gg-dv-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
                .gg-dv-dot.online { background:#2d5a3d; box-shadow:0 0 0 2px rgba(45,90,61,0.25); animation:pulseDot 2s ease-in-out infinite; }
                .gg-dv-dot.offline { background:#aaa; }
                @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 2px rgba(45,90,61,0.25)} 50%{box-shadow:0 0 0 4px rgba(45,90,61,0.1)} }
                .gg-dv-count { display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#9ab5a5; margin-bottom:20px; }
                .gg-dv-count-num { background:rgba(168,213,181,0.2); border:1px solid rgba(168,213,181,0.3); color:var(--moss); font-weight:600; font-size:11px; padding:1px 8px; border-radius:20px; }
                .gg-dv-form-card { background:rgba(255,255,255,0.88); border:1px solid rgba(168,213,181,0.3); border-radius:18px; overflow:hidden; box-shadow:0 4px 20px rgba(26,58,42,0.08); position:sticky; top:24px; }
                .gg-dv-form-header { padding:16px 22px; display:flex; align-items:center; gap:8px; font-size:13.5px; font-weight:500; color:var(--forest); background:rgba(245,240,232,0.5); border-bottom:1px solid rgba(168,213,181,0.2); }
                .gg-dv-form-header svg { color:var(--moss); }
                .gg-dv-form-body { padding:20px 22px; }
                .gg-dv-field { margin-bottom:16px; }
                .gg-dv-label { display:block; font-size:10.5px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; color:var(--moss); margin-bottom:7px; }
                .gg-dv-input { width:100%; padding:10px 14px; font-family:'DM Sans',sans-serif; font-size:13.5px; color:var(--forest); background:rgba(245,240,232,0.6); border:1.5px solid rgba(90,138,106,0.22); border-radius:10px; outline:none; transition:border-color 0.2s,box-shadow 0.2s,background 0.2s; box-sizing:border-box; }
                .gg-dv-input:focus { border-color:var(--moss); background:#fff; box-shadow:0 0 0 3px rgba(90,138,106,0.1); }
                .gg-dv-input::placeholder { color:#b0c4b8; }
                .gg-dv-hint { font-size:11px; color:#9ab5a5; margin-top:5px; line-height:1.4; }
                .gg-dv-submit { width:100%; padding:12px; background:linear-gradient(135deg,var(--forest),var(--moss)); color:var(--cream); border:none; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 4px 14px rgba(26,58,42,0.25); display:flex; align-items:center; justify-content:center; gap:8px; margin-top:4px; }
                .gg-dv-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 7px 20px rgba(26,58,42,0.32); }
                .gg-dv-submit:disabled { opacity:0.65; cursor:not-allowed; }
                .gg-del-overlay { position:fixed; inset:0; background:rgba(10,25,16,0.55); backdrop-filter:blur(4px); z-index:2000; display:flex; align-items:center; justify-content:center; animation:delOverIn 0.2s ease; }
                @keyframes delOverIn { from{opacity:0} to{opacity:1} }
                .gg-del-modal { background:var(--warm-white); border:1px solid rgba(168,213,181,0.35); border-radius:20px; width:100%; max-width:400px; margin:20px; box-shadow:0 32px 80px rgba(10,25,16,0.25); animation:delModalIn 0.25s cubic-bezier(.22,1,.36,1); overflow:hidden; }
                @keyframes delModalIn { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
                .gg-del-header { padding:20px 24px 16px; display:flex; align-items:center; gap:12px; border-bottom:1px solid rgba(168,213,181,0.2); }
                .gg-del-header-icon { width:38px; height:38px; border-radius:10px; background:rgba(185,64,64,0.1); border:1px solid rgba(185,64,64,0.2); display:flex; align-items:center; justify-content:center; color:#b94040; font-size:15px; flex-shrink:0; }
                .gg-del-title { font-family:'Playfair Display',serif; font-size:18px; font-weight:700; color:var(--forest); margin:0; }
                .gg-del-close { margin-left:auto; background:none; border:none; font-size:18px; color:#9ab5a5; cursor:pointer; padding:2px 4px; transition:color 0.2s; line-height:1; }
                .gg-del-close:hover { color:var(--forest); }
                .gg-del-body { padding:20px 24px; }
                .gg-del-body p { font-size:14px; color:#4a6356; line-height:1.6; margin:0 0 6px; }
                .gg-del-body p strong { color:var(--forest); }
                .gg-del-hint { font-size:12px !important; color:#9ab5a5 !important; }
                .gg-del-preview { display:flex; align-items:center; gap:12px; padding:12px 14px; background:rgba(185,64,64,0.05); border:1px solid rgba(185,64,64,0.12); border-radius:10px; margin-top:12px; }
                .gg-del-preview-icon { width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
                .gg-del-preview-name { font-size:13.5px; font-weight:500; color:var(--forest); }
                .gg-del-preview-serial { font-size:11px; color:#9ab5a5; }
                .gg-del-footer { padding:14px 24px 20px; display:flex; justify-content:flex-end; gap:10px; border-top:1px solid rgba(168,213,181,0.15); }
                .gg-del-cancel { padding:9px 18px; background:rgba(168,213,181,0.12); border:1px solid rgba(168,213,181,0.3); border-radius:9px; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500; color:var(--sage); cursor:pointer; transition:all 0.18s; }
                .gg-del-cancel:hover:not(:disabled) { background:rgba(168,213,181,0.22); color:var(--forest); }
                .gg-del-cancel:disabled { opacity:0.5; cursor:not-allowed; }
                .gg-del-confirm { padding:9px 20px; background:linear-gradient(135deg,#b94040,#d05050); color:#fff; border:none; border-radius:9px; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500; cursor:pointer; transition:all 0.18s; box-shadow:0 3px 10px rgba(185,64,64,0.25); display:flex; align-items:center; gap:7px; }
                .gg-del-confirm:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 5px 16px rgba(185,64,64,0.35); }
                .gg-del-confirm:disabled { opacity:0.6; cursor:not-allowed; }
                .gg-spin { width:13px; height:13px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:ggSpin 0.7s linear infinite; display:inline-block; }
                @keyframes ggSpin { to{transform:rotate(360deg)} }
                
                /* Force SVGs inside your custom buttons to render */
                .gg-dv-delete svg, 
                .gg-dv-status svg, 
                .gg-dv-submit svg, 
                .gg-del-confirm svg {
                 display: inline-block !important;
                 width: 1em !important;
                 height: 1em !important;
                 visibility: visible !important;
                 opacity: 1 !important;
}
            `}</style>

            <div className="gg-dv-blob gg-dv-blob-1" />
            <div className="gg-dv-blob gg-dv-blob-2" />

            <div className="gg-dv-content">
                <div className="gg-dv-eyebrow">Energy Sites</div>
                <h1 className="gg-dv-h1">My Energy Sites</h1>
                <p className="gg-dv-sub">Manage your connected solar devices and monitor their status.</p>

                <div className="gg-dv-layout">
                    {/* Device List */}
                    <div>
                        <div className="gg-dv-count">
                            <span className="gg-dv-count-num">{devices.length}</span>
                            {devices.length === 1 ? 'device registered' : 'devices registered'}
                        </div>
                        <div className="gg-dv-grid">
                            {devices.length === 0 && (
                                <div className="gg-dv-empty">
                                    <div className="gg-dv-empty-icon"><FaSolarPanel /></div>
                                    <h5>No devices yet</h5>
                                    <p>Enter your device's serial number to register it.</p>
                                </div>
                            )}
                            {devices.map((device, idx) => {
                                const normalized = normalizeType(device.type);
                                const accent = getDeviceAccent(device.type);
                                const isOnline = device.status === 'ONLINE';
                                return (
                                    <div key={device.id} className="gg-dv-card" style={{ animationDelay: `${idx * 0.06}s` }}>
                                        <style>{`.gg-dv-card:nth-child(${idx+1})::before{background:${accent.color}}`}</style>
                                        <div className="gg-dv-card-top">
                                            <div className="gg-dv-icon-wrap" style={{ background: accent.bg, color: accent.color, border: `1px solid ${accent.border}` }}>
                                                {getDeviceIcon(device.type)}
                                            </div>
                                            <button className="gg-dv-delete" onClick={() => confirmDelete(device)}>
                                                <FaTrash size={14} style={{ display: 'inline-block', visibility: 'visible', fill: 'currentColor' }} />
                                            </button>
                                        </div>
                                        <div className="gg-dv-name">{device.name}</div>
                                        <div className="gg-dv-serial">{device.serialNumber}</div>
                                        <div className="gg-dv-type-tag" style={{ background: accent.bg, color: accent.color, border: `1px solid ${accent.border}` }}>
                                            {normalized}
                                        </div>
                                        <br />
                                        <button className={`gg-dv-status ${isOnline ? 'online' : 'offline'}`} onClick={() => toggleStatus(device.id, device.status)}>
                                            <span className={`gg-dv-dot ${isOnline ? 'online' : 'offline'}`} />
                                            {isOnline ? <FaCheckCircle /> : <FaTimesCircle />}
                                            {device.status} — click to toggle
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Register Form */}
                    <div className="gg-dv-form-card">
                        <div className="gg-dv-form-header"><FaPlus /> Register New Site</div>
                        <div className="gg-dv-form-body">
                            <form onSubmit={handleAddDevice}>
                                <div className="gg-dv-field">
                                    <label className="gg-dv-label">Site / Device Name</label>
                                    <input
                                        type="text" className="gg-dv-input"
                                        placeholder="e.g. Roof Panel A"
                                        value={name}
                                        onFocus={() => setFocused('name')}
                                        onBlur={() => setFocused('')}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* ✅ Serial number only — backend validates against inventory */}
                                <div className="gg-dv-field">
                                    <label className="gg-dv-label">Device Serial Number</label>
                                    <input
                                        type="text" className="gg-dv-input"
                                        placeholder="e.g. SN-1234"
                                        value={serial}
                                        onFocus={() => setFocused('serial')}
                                        onBlur={() => setFocused('')}
                                        onChange={e => setSerial(e.target.value)}
                                        required
                                    />
                                    <div className="gg-dv-hint">
                                        Enter the serial number found on your physical device. It must match a registered inventory item.
                                    </div>
                                </div>

                                <button type="submit" className="gg-dv-submit" disabled={loading}>
                                    {loading
                                        ? <><span className="gg-spin" /> Verifying & Registering…</>
                                        : <><FaPlus style={{ fontSize: 12 }} /> Add Device</>
                                    }
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deviceToDelete && (
                <div className="gg-del-overlay" onClick={closeDeleteModal}>
                    <div className="gg-del-modal" onClick={e => e.stopPropagation()}>
                        <div className="gg-del-header">
                            <div className="gg-del-header-icon"><FaExclamationTriangle /></div>
                            <h5 className="gg-del-title">Remove Device</h5>
                            <button className="gg-del-close" onClick={closeDeleteModal} disabled={deleteLoading}>✕</button>
                        </div>
                        <div className="gg-del-body">
                            <p>Are you sure you want to <strong>permanently remove</strong> this device?</p>
                            <p className="gg-del-hint">The serial number will be returned to inventory and become available again.</p>
                            <div className="gg-del-preview">
                                <div className="gg-del-preview-icon" style={{
                                    background: getDeviceAccent(deviceToDelete.type).bg,
                                    color: getDeviceAccent(deviceToDelete.type).color,
                                    border: `1px solid ${getDeviceAccent(deviceToDelete.type).border}`
                                }}>
                                    {getDeviceIcon(deviceToDelete.type)}
                                </div>
                                <div>
                                    <div className="gg-del-preview-name">{deviceToDelete.name}</div>
                                    <div className="gg-del-preview-serial">{deviceToDelete.serialNumber}</div>
                                </div>
                            </div>
                        </div>
                        <div className="gg-del-footer">
                            <button className="gg-del-cancel" onClick={closeDeleteModal} disabled={deleteLoading}>Cancel</button>
                            <button className="gg-del-confirm" onClick={executeDelete} disabled={deleteLoading}>
                                {deleteLoading
                                    ? <><span className="gg-spin" /> Removing…</>
                                    : <><FaTrash style={{ fontSize: 12 }} /> Yes, Remove</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MyDevices;