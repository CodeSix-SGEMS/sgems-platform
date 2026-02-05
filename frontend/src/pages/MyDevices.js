import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaSolarPanel, FaBolt, FaWind, FaPlus, FaTrash } from 'react-icons/fa';

function MyDevices() {
    const { user } = useContext(AuthContext);
    const [devices, setDevices] = useState([]);

    // New Device Form State
    const [newDevice, setNewDevice] = useState({
        name: '',
        type: 'SOLAR_PANEL',
        serialNumber: ''
    });

    // 1. Load Devices when page opens
    useEffect(() => {
        if (user) fetchDevices();
    }, [user]);

    const fetchDevices = async () => {
        // We pass the User ID to get only THEIR devices
        const response = await fetch(`http://localhost:8080/api/devices?userId=${user.id}`);
        const data = await response.json();
        setDevices(data);
    };

    // 2. Add Device Logic
    const handleAddDevice = async (e) => {
        e.preventDefault();

        const payload = {
            userId: user.id, // Attach current user
            ...newDevice
        };

        const response = await fetch('http://localhost:8080/api/devices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Device Added Successfully!");
            setNewDevice({ name: '', type: 'SOLAR_PANEL', serialNumber: '' }); // Reset form
            fetchDevices(); // Refresh list
        } else {
            alert("Failed to add device");
        }
    };

    // 3. Delete Device
    const handleDelete = async (id) => {
        if (!window.confirm("Remove this device?")) return;

        await fetch(`http://localhost:8080/api/devices/${id}`, { method: 'DELETE' });
        fetchDevices(); // Refresh list
    };

    // 4. Toggle Status (Online/Offline)
    const toggleStatus = async (device) => {
        const newStatus = device.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';

        await fetch(`http://localhost:8080/api/devices/${device.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        fetchDevices();
    };


    // Helper to pick icons
    const getIcon = (type) => {
        if (type === 'SOLAR_PANEL') return <FaSolarPanel className="text-warning" size={24} />;
        if (type === 'WIND_TURBINE') return <FaWind className="text-info" size={24} />;
        return <FaBolt className="text-danger" size={24} />;
    };

    return (
        <div className="container-fluid">
            <h2 className="mb-4">My Energy Devices</h2>

            <div className="row">
                {/* Left Side: Device List */}
                <div className="col-md-8">
                    <div className="row g-3">
                        {devices.length === 0 ? (
                            <p className="text-muted">No devices found. Add one to get started!</p>
                        ) : (
                            devices.map(device => (
                                <div key={device.id} className="col-md-6">
                                    <div className="card shadow-sm border-0 h-100">
                                        <div className="card-body d-flex align-items-center">
                                            <div className="me-3 p-3 bg-light rounded-circle">
                                                {getIcon(device.type)}
                                            </div>
                                            <div className="flex-grow-1">
                                                <h5 className="mb-1">{device.name}</h5>
                                                <small className="text-muted d-block">SN: {device.serialNumber}</small>

                                                {/* Click badge to toggle status */}
                                                <span
                                                    onClick={() => toggleStatus(device)}
                                                    className={`badge bg-${device.status === 'ONLINE' ? 'success' : 'secondary'}`}
                                                    style={{cursor: 'pointer'}}
                                                >
                                                    {device.status} (Click to Toggle)
                                                </span>
                                            </div>

                                            {/* Delete Button */}
                                            <button onClick={() => handleDelete(device.id)} className="btn btn-outline-danger btn-sm ms-2">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Side: Add Form */}
                <div className="col-md-4">
                    <div className="card shadow-sm p-4">
                        <h5 className="mb-3"><FaPlus className="me-2" /> Register New Device</h5>
                        <form onSubmit={handleAddDevice}>
                            <div className="mb-3">
                                <label className="form-label">Device Name</label>
                                <input type="text" className="form-control" placeholder="e.g. Roof Panel A"
                                       value={newDevice.name} onChange={e => setNewDevice({...newDevice, name: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Device Type</label>
                                <select className="form-select"
                                        value={newDevice.type} onChange={e => setNewDevice({...newDevice, type: e.target.value})}>
                                    <option value="SOLAR_PANEL">Solar Panel</option>
                                    <option value="SMART_METER">Smart Meter</option>
                                    <option value="WIND_TURBINE">Wind Turbine</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Serial Number</label>
                                <input type="text" className="form-control" placeholder="SN-12345"
                                       value={newDevice.serialNumber} onChange={e => setNewDevice({...newDevice, serialNumber: e.target.value})} required />
                            </div>
                            <button type="submit" className="btn btn-success w-100">Add Device</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyDevices;