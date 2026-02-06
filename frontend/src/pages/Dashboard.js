import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaBolt, FaServer, FaUserCheck, FaSolarPanel, FaLeaf, FaDollarSign } from 'react-icons/fa';
import EnergyChart from '../components/EnergyChart';

function Dashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({});
    const [chartData, setChartData] = useState([]); // <--- New State

    useEffect(() => {
        if (!user) return;
        fetchStats();
        fetchChartData(); // <--- Fetch Chart
    }, [user]);

    const fetchStats = async () => {
        const url = user.role === 'ADMIN'
            ? 'http://localhost:8080/api/stats'
            : `http://localhost:8080/api/stats/user/${user.id}`;

        try {
            const response = await fetch(url);
            if (response.ok) setStats(await response.json());
        } catch (error) { console.error("Stats Error", error); }
    };

    // New Function: Fetch Chart Data from Backend
    const fetchChartData = async () => {
        try {
            // We tell the backend who we are (ADMIN or USER) so it scales the numbers
            const response = await fetch(`http://localhost:8080/api/stats/chart?role=${user.role}`);
            if (response.ok) {
                setChartData(await response.json());
            }
        } catch (error) { console.error("Chart Error", error); }
    };

    // ... (Keep your adminCards and userCards definitions exactly the same) ...
    // ... (Keep the cardsToShow logic) ...

    // --- COPY PASTE YOUR EXISTING CARD DEFINITIONS HERE ---
    const adminCards = [
        { title: "System Status", value: stats.systemStatus || "Online", color: "success", icon: <FaServer /> },
        { title: "Active Users", value: stats.activeUsers || 0, color: "primary", icon: <FaUserCheck /> },
        { title: "Total Energy Saved", value: stats.energySaved || "0 kWh", color: "warning", icon: <FaBolt /> },
        { title: "Total Devices", value: stats.connectedDevices || 0, color: "info", icon: <FaSolarPanel /> },
    ];

    const userCards = [
        { title: "My Devices", value: stats.myDevices || 0, color: "primary", icon: <FaSolarPanel /> },
        { title: "Energy Generated", value: stats.energyGenerated || "0 kWh", color: "success", icon: <FaBolt /> },
        { title: "Consumption", value: stats.energyConsumed || "0 kWh", color: "danger", icon: <FaLeaf /> },
        { title: "Est. Savings", value: stats.netSavings || "$0.00", color: "warning", icon: <FaDollarSign /> },
    ];

    const cardsToShow = user.role === 'ADMIN' ? adminCards : userCards;

    return (
        <div className="container-fluid">
            <h2 className="mb-4">{user.role === 'ADMIN' ? 'System Overview' : 'My Home Energy'}</h2>
            <p className="text-muted">Welcome back, {user?.fullName}. Here is your summary.</p>

            {/* Stat Cards Row */}
            <div className="row g-4 mb-5">
                {cardsToShow.map((stat, index) => (
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

            {/* Analytics Section */}
            <div className="card shadow-sm">
                <div className="card-header bg-white fw-bold">
                    <FaBolt className="me-2 text-warning" />
                    {user.role === 'ADMIN' ? 'Global Grid Load (Live)' : 'My Energy Consumption History (Live)'}
                </div>
                <div className="card-body">
                    {/* Pass the FETCHED data, not the role */}
                    <EnergyChart data={chartData} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;