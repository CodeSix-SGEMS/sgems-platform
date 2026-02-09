import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaSolarPanel, FaBolt, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify'; // <--- 1. Import Toast

function MyDevices() {
    const { user } = useContext(AuthContext);
    const [devices, setDevices] = useState([]);

    // Form State
    const [name, setName] = useState('');
    const [type, setType] = useState('Solar Panel');
    const [serial, setSerial] = useState('');
    const [loading, setLoading] = useState(false); // <--- 2. Add Loading State

    // Fetch Devices
    useEffect(() => {
        if (user) {
            fetch(`http://localhost:8080/api/devices/my-devices/${user.id}`)
                .then(res => {
                    if (!res.ok) throw new Error("API Error"); // Catch 404/500
                    return res.json();
                })
                .then(data => {
                    // Check if data is an Array. If not, set to empty []
                    if (Array.isArray(data)) {
                        setDevices(data);
                    } else {
                        console.error("API returned non-array:", data);
                        setDevices([]); // Safety Fallback
                        toast.error("Received invalid data from server.");
                    }
                })
                .catch(err => {
                    console.error(err);
                    setDevices([]); // Safety Fallback
                    // toast.error("Failed to load devices"); // Optional: suppress to avoid spam
                });
        }
    }, [user]);

    // Add Device
    const handleAddDevice = async (e) => {
        e.preventDefault();

        if(!name || !serial) {
            toast.warning("Please fill in all fields!"); // <--- Professional Warning
            return;
        }

        setLoading(true); // Disable button
        try {
            const response = await fetch(`http://localhost:8080/api/devices/add?userId=${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    type: type,
                    serialNumber: serial,
                    status: "ONLINE"
                })
            });

            if (response.ok) {
                const newDevice = await response.json();
                setDevices([...devices, newDevice]);
                setName('');
                setSerial('');
                toast.success("Device registered successfully! 🚀"); // <--- Success Toast
            } else {
                toast.error("Failed to register device. Serial might exist.");
            }
        } catch (error) {
            toast.error("Server Error: Could not add device.");
        } finally {
            setLoading(false); // Re-enable button
        }
    };

    // Toggle Status
    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
        try {
            await fetch(`http://localhost:8080/api/devices/${id}/status?status=${newStatus}`, { method: 'PUT' });

            setDevices(devices.map(d => d.id === id ? { ...d, status: newStatus } : d));

            if(newStatus === 'ONLINE') toast.info("Device is back Online 🟢");
            else toast.warn("Device is now Offline 🔴");

        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    // Delete Device
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this device?")) return;

        try {
            await fetch(`http://localhost:8080/api/devices/${id}`, { method: 'DELETE' });
            setDevices(devices.filter(d => d.id !== id));
            toast.success("Device removed.");
        } catch (error) {
            toast.error("Failed to delete device.");
        }
    };

    return (
        <div className="container-fluid">
            <h2 className="mb-4 text-success">My Energy Sites</h2>

            <div className="row g-4">
                {/* LIST SECTION */}
                <div className="col-md-8">
                    <div className="row">
                        {devices.length === 0 && (
                            <div className="col-12 text-center text-muted py-5">
                                <h5>No devices found.</h5>
                                <p>Register your first solar inverter to start monitoring.</p>
                            </div>
                        )}
                        {devices.map((device) => (
                            <div className="col-md-6 mb-3" key={device.id}>
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <div className={`p-3 rounded-circle me-3 ${device.type === 'Solar Panel' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                                {device.type === 'Solar Panel' ? <FaSolarPanel size={24}/> : <FaBolt size={24}/>}
                                            </div>
                                            <div>
                                                <h6 className="mb-1 fw-bold">{device.name}</h6>
                                                <small className="text-muted d-block">{device.serialNumber}</small>

                                                {/* Status Toggle Badge */}
                                                <span
                                                    onClick={() => toggleStatus(device.id, device.status)}
                                                    className={`badge mt-2 cursor-pointer ${device.status === 'ONLINE' ? 'bg-success' : 'bg-secondary'}`}
                                                    style={{cursor: 'pointer'}}
                                                >
                                                    {device.status === 'ONLINE' ? <FaCheckCircle className="me-1"/> : <FaTimesCircle className="me-1"/>}
                                                    {device.status} (Click to Toggle)
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(device.id)} className="btn btn-outline-danger btn-sm">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ADD FORM SECTION */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white fw-bold">
                            <FaPlus className="me-2 text-success"/> Register New Site
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleAddDevice}>
                                <div className="mb-3">
                                    <label className="form-label small text-muted">Site/Device Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Roof Panel A"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small text-muted">Device Type</label>
                                    <select
                                        className="form-select"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <option>Solar Panel</option>
                                        <option>Inverter</option>
                                        <option>Smart Meter</option>
                                        <option>Battery</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small text-muted">Serial Number (Solarman)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="SN-12345"
                                        value={serial}
                                        onChange={(e) => setSerial(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                                    {loading ? "Registering..." : "Add Device"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyDevices;