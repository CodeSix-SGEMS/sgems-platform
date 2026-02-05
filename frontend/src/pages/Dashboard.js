import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaBolt, FaServer, FaUserCheck, FaClock } from 'react-icons/fa';

function Dashboard() {
    const { user } = useContext(AuthContext);

    // Dummy Stats (We will make these real later)
    const stats = [
        { title: "System Status", value: "Online", color: "success", icon: <FaServer /> },
        { title: "Active Users", value: "3", color: "primary", icon: <FaUserCheck /> },
        { title: "Energy Saved", value: "124 kWh", color: "warning", icon: <FaBolt /> },
        { title: "Uptime", value: "99.9%", color: "info", icon: <FaClock /> },
    ];

    return (
        <div className="container-fluid">
            <h2 className="mb-4">Dashboard Overview</h2>
            <p className="text-muted">Welcome back, {user?.fullName}. Here is your system summary.</p>

            {/* Stat Cards Row */}
            <div className="row g-4 mb-5">
                {stats.map((stat, index) => (
                    <div key={index} className="col-md-3">
                        <div className={`card shadow-sm border-start border-4 border-${stat.color} h-100`}>
                            <div className="card-body d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 className="text-muted fw-normal mb-1">{stat.title}</h6>
                                    <h3 className="mb-0 fw-bold">{stat.value}</h3>
                                </div>
                                <div className={`text-${stat.color} fs-1 opacity-25`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Action Area (Placeholder) */}
            <div className="card shadow-sm">
                <div className="card-header bg-white fw-bold">
                    System Analytics
                </div>
                <div className="card-body text-center py-5">
                    <p className="text-muted">Energy consumption charts will appear here.</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;