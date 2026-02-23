import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
// Ensure FaSyncAlt is imported here
import { FaBolt, FaServer, FaUserCheck, FaSolarPanel, FaLeaf, FaDollarSign, FaSyncAlt } from 'react-icons/fa';
import EnergyChart from '../components/EnergyChart';
import WeatherWidget from '../components/WeatherWidget';

const API_BASE_URL = '';

function Dashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({});
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDays, setSelectedDays] = useState(7);

    // 1. Move loadData OUT here so the button can use it
    const loadData = async () => {
        if (!user) return;

        console.log("🔄 Loading data...");
        setLoading(true);

        // Fetch stats
        try {
            const statsUrl = user.role === 'ADMIN' ? `${API_BASE_URL}/api/stats` : `${API_BASE_URL}/api/stats/user/${user.id}`;
            const statsRes = await fetch(statsUrl);
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (err) {
            console.error("Stats error:", err);
        }

        // Fetch chart
        try {
            const chartUrl = `${API_BASE_URL}/api/stats/chart?role=${user.role}&days=${selectedDays}`;
            console.log("📊 Fetching:", chartUrl);
            const chartRes = await fetch(chartUrl);
            if (chartRes.ok) {
                const data = await chartRes.json();
                console.log("✅ Got data:", data);
                setChartData(data);
                setError(null);
            } else {
                setError("Failed to load chart");
            }
        } catch (err) {
            console.error("Chart error:", err);
            setError("Failed to load chart");
        }

        setLoading(false);
    };

    // 2. useEffect now just calls the function above
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, selectedDays]);

    const adminCards = [
        { title: "System Status", value: stats.systemStatus || "Offline", color: "success", icon: <FaServer /> },
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

    const cardsToShow = user?.role === 'ADMIN' ? adminCards : userCards;

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                {/* Header Row with Weather Widget */}
                <div className="row align-items-center mb-4">
                    <div className="col-md-8">
                        <h2 className="mb-1 fw-bold text-dark">
                            {user.role === 'ADMIN' ? 'System Overview' : 'My Home Energy'}
                        </h2>
                        <p className="text-muted mb-0">Welcome back, {user.fullName}. Here's what's happening today.</p>
                    </div>
                    <div className="col-md-4">
                        <WeatherWidget />
                    </div>
                </div>

                {/* 3. ADD THIS BUTTON HERE */}
                <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={loadData}
                    disabled={loading}
                >
                    <FaSyncAlt className={loading ? "fa-spin" : ""} />
                    Refresh Data
                </button>

            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-4 mb-5">
                {cardsToShow.map((stat, idx) => (
                    <div key={idx} className="col-md-3">
                        <div className={`card shadow-sm border-start border-4 border-${stat.color} h-100`}>
                            <div className="card-body d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 className="text-muted fw-normal mb-1">{stat.title}</h6>
                                    <h3 className="mb-0 fw-bold">{stat.value}</h3>
                                </div>
                                <div className={`text-${stat.color} fs-1 opacity-25`}>{stat.icon}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <div>
                        <FaBolt className="me-2 text-warning" />
                        My Energy History
                    </div>
                    <div className="btn-group">
                        <button className={`btn btn-sm ${selectedDays === 7 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedDays(7)}>7 Days</button>
                        <button className={`btn btn-sm ${selectedDays === 14 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedDays(14)}>14 Days</button>
                        <button className={`btn btn-sm ${selectedDays === 30 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedDays(30)}>30 Days</button>
                    </div>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border"></div>
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="text-center py-5">No data</div>
                    ) : (
                        <EnergyChart data={chartData} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;