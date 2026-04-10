import React, { useState, useEffect, useContext } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import "../../App.css";

const API_BASE = "http://localhost:8080/api/alerts";

export default function Alerts() {
    const { user } = useContext(AuthContext);
    const [alerts, setAlerts] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        id: null,
        systemId: "",
        issue: "",
        severity: "Low",
        status: "Active",
        voltage: "",
        battery: ""
    });

    // Fetch all data on mount
    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const [alertsRes, historyRes] = await Promise.all([
                fetch(`${API_BASE}?userId=${user.id}`),
                fetch(`${API_BASE}/history?userId=${user.id}`)
            ]);
            if (!alertsRes.ok) throw new Error("Failed to fetch alerts");
            if (!historyRes.ok) throw new Error("Failed to fetch history");
            const alertsData = await alertsRes.json();
            const historyData = await historyRes.json();
            setAlerts(alertsData);
            setHistory(historyData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.systemId || !form.issue) {
            alert("Fill required fields!");
            return;
        }

        try {
            let url = API_BASE;
            let method = "POST";
            let body = {
                systemId: form.systemId,
                issue: form.issue,
                severity: form.severity,
                status: form.status,
                voltage: form.voltage,
                battery: form.battery,
                userId: user.id
            };

            if (form.id !== null) {
                url = `${API_BASE}/${form.id}?userId=${user.id}`;
                method = "PUT";
                body.id = form.id;
            }

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error("Operation failed");

            await fetchData();

            setForm({
                id: null,
                systemId: "",
                issue: "",
                severity: "Low",
                status: "Active",
                voltage: "",
                battery: ""
            });
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEdit = (alert) => {
        setForm({
            id: alert.id,
            systemId: alert.systemId,
            issue: alert.issue,
            severity: alert.severity,
            status: alert.status,
            voltage: alert.voltage,
            battery: alert.battery
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this alert? It will be moved to history.")) return;
        try {
            const response = await fetch(`${API_BASE}/${id}?userId=${user.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            await fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    const clearHistory = async () => {
        if (!window.confirm("Clear all deleted history? This action cannot be undone.")) return;
        try {
            const response = await fetch(`${API_BASE}/history?userId=${user.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Clear history failed");
            await fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    // Prepare chart data
    const chartData = alerts.map((a, i) => ({
        name: `A${i + 1}`,
        battery: Number(a.battery) || 0
    }));

    if (!user) return <div className="container">Loading user...</div>;
    if (loading) return <div className="container">Loading alerts...</div>;
    if (error) return <div className="container error">Error: {error}</div>;

    return (
        <div className="container">
            <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                ☀️ Solar Alert System
            </motion.h2>

            <div className="card">
                <input
                    placeholder="System ID"
                    value={form.systemId}
                    onChange={e => setForm({ ...form, systemId: e.target.value })}
                />
                <input
                    placeholder="Issue"
                    value={form.issue}
                    onChange={e => setForm({ ...form, issue: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Voltage"
                    value={form.voltage}
                    onChange={e => setForm({ ...form, voltage: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Battery %"
                    value={form.battery}
                    onChange={e => setForm({ ...form, battery: e.target.value })}
                />
                <select
                    value={form.severity}
                    onChange={e => setForm({ ...form, severity: e.target.value })}
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                </select>
                <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                >
                    <option>Active</option>
                    <option>Resolved</option>
                    <option>Maintenance</option>
                </select>
                <button onClick={handleSubmit}>
                    {form.id !== null ? "Update" : "Add Alert"}
                </button>
            </div>

            <div className="card">
                <h3>🔋 Battery Levels</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="battery" stroke="#ff7300" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="card">
                <h3>⚠️ Active Alerts</h3>
                <AnimatePresence>
                    {alerts.length === 0 ? (
                        <p>No active alerts</p>
                    ) : (
                        alerts.map(a => (
                            <motion.div
                                key={a.id}
                                className={`alert-item ${a.severity.toLowerCase()}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <b>{a.systemId}</b> - {a.issue}
                                <br />⚡ {a.voltage}V | 🔋 {a.battery}%
                                <br />{a.severity} | {a.status}
                                <br />
                                <button onClick={() => handleEdit(a)}>Edit</button>
                                <button onClick={() => handleDelete(a.id)}>Delete</button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="card">
                <h3>🧾 Deleted History</h3>
                <button onClick={clearHistory}>Clear History</button>
                <table>
                    <thead>
                    <tr>
                        <th>System</th>
                        <th>Issue</th>
                        <th>Battery</th>
                        <th>Deleted Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.length === 0 ? (
                        <tr><td colSpan="4">No history</td></tr>
                    ) : (
                        history.map((h, idx) => (
                            <tr key={idx}>
                                <td>{h.systemId}</td>
                                <td>{h.issue}</td>
                                <td>{h.battery}%</td>
                                <td>{new Date(h.deletedAt).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}