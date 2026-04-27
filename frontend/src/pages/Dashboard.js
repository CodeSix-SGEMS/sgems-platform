import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaBolt, FaServer, FaUserCheck, FaSolarPanel, FaLeaf, FaDollarSign, FaSyncAlt } from 'react-icons/fa';
import EnergyChart from '../components/EnergyChart';
import WeatherWidget from '../components/WeatherWidget';
import DevicePieChart from '../components/DevicePieChart';
import EnergyFlowChart from '../components/EnergyFlowChart';

const API_BASE_URL = '';

function Dashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({});
    const [chartData, setChartData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDays, setSelectedDays] = useState(7);

    // Wrap loadData with useCallback to keep it stable for intervals
    const loadData = useCallback(async () => {
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

        // Fetch device pie data (using static demo data if API not ready)
        try {
            // For now, use demo data – replace with real API when available
            setDeviceData([
                { name: "Solar Panel A", value: 120.5 },
                { name: "Inverter B",    value: 98.2  },
                { name: "Battery C",     value: 45.0  }
            ]);
        } catch (err) {
            console.error("Device chart error:", err);
        }

        // Fetch chart (energy history)
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
    }, [user, selectedDays]);

    // Initial load and when dependencies change
    useEffect(() => {
        loadData();
    }, [user, selectedDays, loadData]);

    // Auto‑refresh every 3 seconds
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(() => {
            if (!loading) {
                loadData();
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [user, loadData, loading]);

    const adminCards = [
        { title: "System Status", value: stats.systemStatus || "Offline", color: "success", icon: <FaServer />, accent: "#2d5a3d" },
        { title: "Active Users", value: stats.activeUsers || 0, color: "primary", icon: <FaUserCheck />, accent: "#3b7abf" },
        { title: "Total Energy Saved", value: stats.energySaved || "0 kWh", color: "warning", icon: <FaBolt />, accent: "#c9a84c" },
        { title: "Total Devices", value: stats.connectedDevices || 0, color: "info", icon: <FaSolarPanel />, accent: "#2d8fa5" },
    ];

    const userCards = [
        { title: "My Devices", value: stats.myDevices || 0, color: "primary", icon: <FaSolarPanel />, accent: "#3b7abf" },
        { title: "Energy Generated", value: stats.energyGenerated || "0 kWh", color: "success", icon: <FaBolt />, accent: "#2d5a3d" },
        { title: "Consumption", value: stats.energyConsumed || "0 kWh", color: "danger", icon: <FaLeaf />, accent: "#b94040" },
        { title: "Est. Savings", value: stats.netSavings || "$0.00", color: "warning", icon: <FaDollarSign />, accent: "#c9a84c" },
    ];

    const cardsToShow = user?.role === 'ADMIN' ? adminCards : userCards;

    if (!user) return <div>Loading...</div>;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

                :root {
                    --forest: #1a3a2a;
                    --moss: #2d5a3d;
                    --sage: #5a8a6a;
                    --mint: #a8d5b5;
                    --cream: #f5f0e8;
                    --warm-white: #fdfaf5;
                    --gold: #c9a84c;
                }

                .gg-dash {
                    font-family: 'DM Sans', sans-serif;
                    background: var(--warm-white);
                    min-height: 100vh;
                    padding: 32px 36px;
                    position: relative;
                }

                .gg-dash-blob {
                    position: fixed;
                    border-radius: 50%;
                    filter: blur(90px);
                    pointer-events: none;
                    z-index: 0;
                }
                .gg-dash-blob-1 {
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(168,213,181,0.18) 0%, transparent 70%);
                    top: -150px; right: 0;
                }
                .gg-dash-blob-2 {
                    width: 350px; height: 350px;
                    background: radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%);
                    bottom: 0; left: 30%;
                }

                .gg-dash-content { position: relative; z-index: 1; }

                .gg-dash-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 32px;
                    gap: 24px;
                    flex-wrap: wrap;
                }

                .gg-dash-eyebrow {
                    font-size: 10.5px;
                    font-weight: 500;
                    letter-spacing: 2.5px;
                    text-transform: uppercase;
                    color: var(--sage);
                    margin-bottom: 6px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .gg-dash-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 18px; height: 2px;
                    background: var(--gold);
                    border-radius: 2px;
                }

                .gg-dash-h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(26px, 3vw, 36px);
                    font-weight: 700;
                    color: var(--forest);
                    letter-spacing: -0.5px;
                    margin: 0 0 6px;
                    line-height: 1.15;
                }

                .gg-dash-sub {
                    font-size: 14px;
                    font-weight: 300;
                    color: #6a8a78;
                    margin: 0;
                }

                .gg-dash-header-right {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    flex-wrap: wrap;
                }

                .gg-refresh-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 18px;
                    background: var(--forest);
                    color: var(--cream);
                    border: none;
                    border-radius: 10px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
                    box-shadow: 0 4px 14px rgba(26,58,42,0.25);
                    white-space: nowrap;
                }
                .gg-refresh-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 7px 20px rgba(26,58,42,0.32);
                }
                .gg-refresh-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .gg-spin { animation: ggSpin 0.8s linear infinite; }
                @keyframes ggSpin { to { transform: rotate(360deg); } }

                .gg-alert {
                    padding: 12px 16px;
                    background: rgba(185,64,64,0.08);
                    border: 1px solid rgba(185,64,64,0.2);
                    border-radius: 10px;
                    color: #9a3030;
                    font-size: 13.5px;
                    margin-bottom: 24px;
                }

                .gg-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 18px;
                    margin-bottom: 28px;
                }
                @media (max-width: 1200px) { .gg-cards-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 600px)  { .gg-cards-grid { grid-template-columns: 1fr; } }

                .gg-stat-card {
                    background: rgba(255,255,255,0.85);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(168,213,181,0.3);
                    border-radius: 16px;
                    padding: 22px 22px 20px;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.22s, box-shadow 0.22s;
                    box-shadow: 0 4px 16px rgba(26,58,42,0.07);
                    animation: cardIn 0.5s cubic-bezier(.22,1,.36,1) both;
                }
                .gg-stat-card:nth-child(1) { animation-delay: 0.05s; }
                .gg-stat-card:nth-child(2) { animation-delay: 0.1s; }
                .gg-stat-card:nth-child(3) { animation-delay: 0.15s; }
                .gg-stat-card:nth-child(4) { animation-delay: 0.2s; }

                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .gg-stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 28px rgba(26,58,42,0.13);
                }
                .gg-stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    border-radius: 16px 16px 0 0;
                }

                .gg-stat-card-inner {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                }

                .gg-stat-label {
                    font-size: 11.5px;
                    font-weight: 500;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    color: #7a9688;
                    margin-bottom: 8px;
                }

                .gg-stat-value {
                    font-family: 'Playfair Display', serif;
                    font-size: 30px;
                    font-weight: 700;
                    color: var(--forest);
                    line-height: 1;
                    letter-spacing: -0.5px;
                }

                .gg-stat-icon-wrap {
                    width: 42px; height: 42px;
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 17px;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .gg-chart-card {
                    background: rgba(255,255,255,0.88);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(168,213,181,0.3);
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(26,58,42,0.08);
                    animation: cardIn 0.5s 0.25s cubic-bezier(.22,1,.36,1) both;
                }

                .gg-chart-header {
                    padding: 18px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid rgba(168,213,181,0.2);
                    background: rgba(245,240,232,0.4);
                }

                .gg-chart-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--forest);
                }

                .gg-chart-title-icon {
                    color: var(--gold);
                    font-size: 13px;
                }

                .gg-day-toggle {
                    display: flex;
                    background: rgba(168,213,181,0.15);
                    border: 1px solid rgba(168,213,181,0.25);
                    border-radius: 8px;
                    padding: 3px;
                    gap: 2px;
                }

                .gg-day-btn {
                    padding: 5px 14px;
                    border: none;
                    border-radius: 6px;
                    background: transparent;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    color: #7a9688;
                    cursor: pointer;
                    transition: all 0.18s;
                }
                .gg-day-btn:hover:not(.active) { color: var(--forest); background: rgba(168,213,181,0.2); }
                .gg-day-btn.active {
                    background: var(--forest);
                    color: var(--cream);
                    box-shadow: 0 2px 8px rgba(26,58,42,0.2);
                }

                .gg-chart-body { padding: 24px; }

                .gg-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    gap: 12px;
                    color: var(--sage);
                    font-size: 13px;
                }
                .gg-loading-ring {
                    width: 22px; height: 22px;
                    border: 2.5px solid rgba(90,138,106,0.2);
                    border-top-color: var(--moss);
                    border-radius: 50%;
                    animation: ggSpin 0.75s linear infinite;
                }

                .gg-no-data {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    color: #9ab5a5;
                    font-size: 14px;
                    font-weight: 300;
                }

                /* Two-column layout for the charts row */
                .gg-charts-row {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 22px;
                    align-items: start;
                }
                @media (max-width: 1100px) { .gg-charts-row { grid-template-columns: 1fr; } }
            `}</style>

            <div className="gg-dash-blob gg-dash-blob-1" />
            <div className="gg-dash-blob gg-dash-blob-2" />

            <div className="gg-dash-content">
                {/* Header */}
                <div className="gg-dash-header">
                    <div className="gg-dash-title-area">
                        <div className="gg-dash-eyebrow">
                            {user.role === 'ADMIN' ? 'System Overview' : 'Home Energy'}
                        </div>
                        <h1 className="gg-dash-h1">
                            {user.role === 'ADMIN' ? 'System Overview' : 'My Home Energy'}
                        </h1>
                        <p className="gg-dash-sub">Welcome back, {user.fullName}. Here's what's happening today.</p>
                    </div>

                    <div className="gg-dash-header-right">
                        <WeatherWidget />
                        <button className="gg-refresh-btn" onClick={loadData} disabled={loading}>
                            <FaSyncAlt className={loading ? "gg-spin" : ""} />
                            Refresh Data
                        </button>
                    </div>
                </div>

                {error && <div className="gg-alert">{error}</div>}

                {/* Stat Cards */}
                <div className="gg-cards-grid">
                    {cardsToShow.map((stat, idx) => (
                        <div key={idx} className="gg-stat-card">
                            <style>{`.gg-stat-card:nth-child(${idx + 1})::before { background: ${stat.accent}; }`}</style>
                            <div className="gg-stat-card-inner">
                                <div>
                                    <div className="gg-stat-label">{stat.title}</div>
                                    <div className="gg-stat-value">{stat.value}</div>
                                </div>
                                <div className="gg-stat-icon-wrap" style={{
                                    background: `${stat.accent}15`,
                                    color: stat.accent,
                                    border: `1px solid ${stat.accent}22`
                                }}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Energy Flow Chart */}
                <div style={{ marginBottom: '28px' }}>
                    <EnergyFlowChart
                        solarKw={stats.currentSolar || 0}
                        consumptionKw={stats.currentConsumption || 0}
                        batteryPct={stats.batteryLevel || 0}
                        gridKw={stats.gridPower || 0}
                    />
                </div>

                {/* Charts row — energy history + pie side by side */}
                <div className="gg-charts-row">
                    {/* Energy History */}
                    <div className="gg-chart-card">
                        <div className="gg-chart-header">
                            <div className="gg-chart-title">
                                <FaBolt className="gg-chart-title-icon" />
                                My Energy History
                            </div>
                            <div className="gg-day-toggle">
                                {[7, 14, 30].map(d => (
                                    <button
                                        key={d}
                                        className={`gg-day-btn${selectedDays === d ? ' active' : ''}`}
                                        onClick={() => setSelectedDays(d)}
                                    >
                                        {d} Days
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="gg-chart-body">
                            {loading ? (
                                <div className="gg-loading">
                                    <div className="gg-loading-ring" />
                                    Loading data…
                                </div>
                            ) : chartData.length === 0 ? (
                                <div className="gg-no-data">No data available for this period</div>
                            ) : (
                                <EnergyChart data={chartData} />
                            )}
                        </div>
                    </div>

                    {/* Device Pie Chart */}
                    <div className="gg-chart-card">
                        <div className="gg-chart-header">
                            <div className="gg-chart-title">
                                <FaSolarPanel className="gg-chart-title-icon" />
                                Energy by Device
                            </div>
                        </div>
                        <div className="gg-chart-body">
                            {deviceData.length === 0 ? (
                                <div className="gg-no-data">No device data</div>
                            ) : (
                                <DevicePieChart data={deviceData} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;