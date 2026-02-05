import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import EnergyChart from '../components/EnergyChart';
import { FaBolt, FaServer, FaUserCheck, FaSolarPanel } from 'react-icons/fa';

function Dashboard() {
    const { user } = useContext(AuthContext);

    // Default State (starts at 0)
    const [stats, setStats] = useState({
        systemStatus: 'Loading...',
        activeUsers: 0,
        energySaved: '0 kWh',
        connectedDevices: 0
    });

    // Fetch live stats on load
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/stats');
                if(response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                setStats(prev => ({ ...prev, systemStatus: 'Offline' }));
            }
        };
        fetchStats();
    }, []);

    // Define the cards dynamically
    const statCards = [
        { title: "System Status", value: stats.systemStatus, color: stats.systemStatus === 'Online' ? "success" : "danger", icon: <FaServer /> },
        { title: "Active Users", value: stats.activeUsers, color: "primary", icon: <FaUserCheck /> },
        { title: "Energy Saved", value: stats.energySaved, color: "warning", icon: <FaBolt /> },
        { title: "Total Devices", value: stats.connectedDevices, color: "info", icon: <FaSolarPanel /> },
    ];

    return (
        <div className="container-fluid">
            <h2 className="mb-4">Dashboard Overview</h2>
            <p className="text-muted">Welcome back, {user?.fullName}. Here is your system summary.</p>

            {/* Stat Cards Row */}
            <div className="row g-4 mb-5">
                {statCards.map((stat, index) => (
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

            {/* ... Keep the Analytics placeholder section below ... */}
            {/* System Analytics Area */}
            <div className="card shadow-sm">
                <div className="card-header bg-white fw-bold">
                    <FaBolt className="me-2 text-warning" />
                    Weekly Energy Analytics (Generated vs Consumed)
                </div>
                <div className="card-body">
                    <EnergyChart />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;