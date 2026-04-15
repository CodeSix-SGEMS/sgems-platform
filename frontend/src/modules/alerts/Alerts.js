import React, { useState, useEffect, useContext } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import "../../App.css";

const API_BASE = "/api/alerts";

const SEVERITY_CONFIG = {
    Low:      { color: "#4ade80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.35)",  dot: "#4ade80" },
    Medium:   { color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.35)",  dot: "#fbbf24" },
    High:     { color: "#f97316", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.35)",  dot: "#f97316" },
    Critical: { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.35)",   dot: "#ef4444" },
};

const STATUS_CONFIG = {
    Active:      { color: "#4ade80", bg: "rgba(74,222,128,0.15)" },
    Resolved:    { color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
    Maintenance: { color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: "rgba(10,31,20,0.92)",
                border: "1px solid rgba(74,222,128,0.25)",
                borderRadius: "10px",
                padding: "10px 16px",
                backdropFilter: "blur(12px)",
                fontFamily: "'DM Sans', sans-serif",
                color: "#e2f5eb",
                fontSize: "13px",
            }}>
                <span style={{ color: "#4ade80", fontWeight: 600 }}>{payload[0].value}%</span> battery
            </div>
        );
    }
    return null;
};

export default function Alerts() {
    const { user } = useContext(AuthContext);
    const [alerts, setAlerts] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        id: null,
        systemId: "",
        issue: "",
        severity: "Low",
        status: "Active",
        voltage: "",
        battery: "",
    });

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
                fetch(`${API_BASE}/history?userId=${user.id}`),
            ]);
            if (!alertsRes.ok) throw new Error("Failed to fetch alerts");
            if (!historyRes.ok) throw new Error("Failed to fetch history");
            setAlerts(await alertsRes.json());
            setHistory(await historyRes.json());
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
            const isEdit = form.id !== null;
            const url    = isEdit ? `${API_BASE}/${form.id}?userId=${user.id}` : API_BASE;
            const method = isEdit ? "PUT" : "POST";
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, userId: user.id }),
            });
            if (!response.ok) throw new Error("Operation failed");
            await fetchData();
            setForm({ id: null, systemId: "", issue: "", severity: "Low", status: "Active", voltage: "", battery: "" });
            setEditingId(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEdit = (alert) => {
        setForm({ id: alert.id, systemId: alert.systemId, issue: alert.issue, severity: alert.severity, status: alert.status, voltage: alert.voltage, battery: alert.battery });
        setEditingId(alert.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this alert? It will be moved to history.")) return;
        try {
            const res = await fetch(`${API_BASE}/${id}?userId=${user.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            await fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    const clearHistory = async () => {
        if (!window.confirm("Clear all deleted history? This action cannot be undone.")) return;
        try {
            const res = await fetch(`${API_BASE}/history?userId=${user.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Clear history failed");
            await fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    const chartData = alerts.map((a, i) => ({
        name: `A${i + 1}`,
        battery: Number(a.battery) || 0,
    }));

    const severityCounts = Object.keys(SEVERITY_CONFIG).reduce((acc, s) => {
        acc[s] = alerts.filter(a => a.severity === s).length;
        return acc;
    }, {});

    /* ─── Shared style tokens ─── */
    const glassCard = {
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "18px",
        padding: "28px 32px",
        marginBottom: "24px",
        position: "relative",
        overflow: "hidden",
    };

    const inputStyle = {
        width: "100%",
        padding: "11px 16px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.06)",
        color: "#e2f5eb",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
    };

    const labelStyle = {
        display: "block",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "12px",
        color: "rgba(226,245,235,0.55)",
        marginBottom: "6px",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontWeight: 500,
    };

    const primaryBtn = {
        padding: "11px 28px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
        color: "#d1fae5",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "opacity 0.18s, transform 0.15s",
        letterSpacing: "0.02em",
    };

    const ghostBtn = {
        padding: "7px 16px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.13)",
        background: "transparent",
        color: "rgba(226,245,235,0.7)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "12px",
        cursor: "pointer",
        transition: "background 0.18s",
        marginRight: "8px",
    };

    const dangerBtn = {
        ...ghostBtn,
        border: "1px solid rgba(239,68,68,0.3)",
        color: "rgba(239,68,68,0.8)",
    };

    if (!user) return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#e2f5eb", padding: "48px", textAlign: "center" }}>
            Loading user…
        </div>
    );

    if (loading) return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#e2f5eb", padding: "48px", textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid rgba(74,222,128,0.2)", borderTopColor: "#4ade80", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            Loading alerts…
        </div>
    );

    if (error) return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#ef4444", padding: "48px", textAlign: "center" }}>
            Error: {error}
        </div>
    );

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #071d0f 0%, #0a2012 50%, #071d0f 100%)",
            padding: "40px 24px",
            fontFamily: "'DM Sans', sans-serif",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Ambient blobs */}
            <div style={{ position: "fixed", top: "-200px", left: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(22,101,52,0.18) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", bottom: "-150px", right: "-150px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(21,128,61,0.13) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

            <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>

                {/* ── Page Header ── */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ marginBottom: "36px" }}
                >
                    <p style={{ color: "rgba(74,222,128,0.7)", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, margin: "0 0 8px" }}>
                        Solar Grid Management
                    </p>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#e2f5eb", margin: "0 0 8px", lineHeight: 1.15 }}>
                        Alert System
                    </h1>
                    <p style={{ color: "rgba(226,245,235,0.5)", fontSize: "14px", margin: 0 }}>
                        Monitor and manage solar grid alerts in real-time
                    </p>
                </motion.div>

                {/* ── Summary Cards ── */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.45 }}
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "14px", marginBottom: "24px" }}
                >
                    {[
                        { label: "Total Alerts", value: alerts.length, color: "#4ade80" },
                        { label: "Critical",     value: severityCounts.Critical, color: "#ef4444" },
                        { label: "High",         value: severityCounts.High,     color: "#f97316" },
                        { label: "Resolved",     value: alerts.filter(a => a.status === "Resolved").length, color: "#60a5fa" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.12 + i * 0.07 }}
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                backdropFilter: "blur(12px)",
                                border: `1px solid rgba(255,255,255,0.08)`,
                                borderRadius: "14px",
                                padding: "18px 20px",
                                borderTop: `2px solid ${stat.color}`,
                            }}
                        >
                            <p style={{ color: "rgba(226,245,235,0.45)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", fontWeight: 600 }}>
                                {stat.label}
                            </p>
                            <p style={{ color: stat.color, fontSize: "28px", fontWeight: 700, fontFamily: "'Playfair Display', serif", margin: 0 }}>
                                {stat.value}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* ── Form Card ── */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.45 }}
                    style={glassCard}
                >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.5), transparent)" }} />
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#e2f5eb", margin: "0 0 24px", fontWeight: 600 }}>
                        {editingId ? "✎ Edit Alert" : "+ New Alert"}
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div>
                            <label style={labelStyle}>System ID *</label>
                            <input
                                style={inputStyle}
                                placeholder="e.g. SYS-001"
                                value={form.systemId}
                                onChange={e => setForm({ ...form, systemId: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Issue *</label>
                            <input
                                style={inputStyle}
                                placeholder="Describe the issue"
                                value={form.issue}
                                onChange={e => setForm({ ...form, issue: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Voltage (V)</label>
                            <input
                                type="number"
                                style={inputStyle}
                                placeholder="0.0"
                                value={form.voltage}
                                onChange={e => setForm({ ...form, voltage: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Battery (%)</label>
                            <input
                                type="number"
                                style={inputStyle}
                                placeholder="0 – 100"
                                value={form.battery}
                                onChange={e => setForm({ ...form, battery: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Severity</label>
                            <select
                                style={{ ...inputStyle, cursor: "pointer" }}
                                value={form.severity}
                                onChange={e => setForm({ ...form, severity: e.target.value })}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Status</label>
                            <select
                                style={{ ...inputStyle, cursor: "pointer" }}
                                value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <button style={primaryBtn} onClick={handleSubmit}
                                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                            {editingId ? "Update Alert" : "Add Alert"}
                        </button>
                        {editingId && (
                            <button
                                style={ghostBtn}
                                onClick={() => { setForm({ id: null, systemId: "", issue: "", severity: "Low", status: "Active", voltage: "", battery: "" }); setEditingId(null); }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* ── Battery Chart ── */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.45 }}
                    style={glassCard}
                >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent)" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                        <div>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#e2f5eb", margin: "0 0 4px", fontWeight: 600 }}>
                                Battery Levels
                            </h2>
                            <p style={{ color: "rgba(226,245,235,0.45)", fontSize: "13px", margin: 0 }}>
                                Across all active alerts
                            </p>
                        </div>
                        <div style={{ padding: "6px 14px", borderRadius: "20px", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80", fontSize: "12px", fontWeight: 600 }}>
                            {alerts.length} nodes
                        </div>
                    </div>

                    {chartData.length === 0 ? (
                        <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(226,245,235,0.3)", fontSize: "14px" }}>
                            No data to display
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="batteryGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#4ade80" />
                                        <stop offset="100%" stopColor="#22d3ee" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" tick={{ fill: "rgba(226,245,235,0.4)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fill: "rgba(226,245,235,0.4)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="battery" stroke="url(#batteryGrad)" strokeWidth={2.5} dot={{ fill: "#4ade80", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#4ade80", stroke: "rgba(74,222,128,0.3)", strokeWidth: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>

                {/* ── Active Alerts ── */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.45 }}
                    style={glassCard}
                >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)" }} />
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#e2f5eb", margin: "0 0 20px", fontWeight: 600 }}>
                        Active Alerts
                    </h2>

                    <AnimatePresence>
                        {alerts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ padding: "40px", textAlign: "center", color: "rgba(226,245,235,0.3)", fontSize: "14px" }}
                            >
                                ✓ No active alerts — system nominal
                            </motion.div>
                        ) : (
                            alerts.map((a, i) => {
                                const sev = SEVERITY_CONFIG[a.severity] || SEVERITY_CONFIG.Low;
                                const sta = STATUS_CONFIG[a.status]    || STATUS_CONFIG.Active;
                                return (
                                    <motion.div
                                        key={a.id}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0,  opacity: 1 }}
                                        exit={{ x: 20,  opacity: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            padding: "16px 18px",
                                            borderRadius: "12px",
                                            background: sev.bg,
                                            border: `1px solid ${sev.border}`,
                                            marginBottom: "10px",
                                            gap: "16px",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", flex: 1 }}>
                                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: sev.dot, marginTop: "5px", flexShrink: 0, boxShadow: `0 0 8px ${sev.dot}` }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                                                    <span style={{ color: "#e2f5eb", fontWeight: 600, fontSize: "14px" }}>{a.systemId}</span>
                                                    <span style={{ padding: "2px 10px", borderRadius: "20px", background: sev.bg, border: `1px solid ${sev.border}`, color: sev.color, fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}>
                            {a.severity}
                          </span>
                                                    <span style={{ padding: "2px 10px", borderRadius: "20px", background: sta.bg, color: sta.color, fontSize: "11px", fontWeight: 600 }}>
                            {a.status}
                          </span>
                                                </div>
                                                <p style={{ color: "rgba(226,245,235,0.7)", fontSize: "13px", margin: "0 0 8px" }}>{a.issue}</p>
                                                <div style={{ display: "flex", gap: "20px" }}>
                                                    <span style={{ color: "rgba(226,245,235,0.45)", fontSize: "12px" }}>⚡ <span style={{ color: "#fbbf24" }}>{a.voltage}V</span></span>
                                                    <span style={{ color: "rgba(226,245,235,0.45)", fontSize: "12px" }}>🔋 <span style={{ color: "#4ade80" }}>{a.battery}%</span></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                                            <button style={ghostBtn} onClick={() => handleEdit(a)}
                                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                Edit
                                            </button>
                                            <button style={dangerBtn} onClick={() => handleDelete(a.id)}
                                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── Deleted History ── */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.45 }}
                    style={glassCard}
                >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(226,245,235,0.15), transparent)" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#e2f5eb", margin: 0, fontWeight: 600 }}>
                            Deleted History
                        </h2>
                        {history.length > 0 && (
                            <button
                                style={{ ...dangerBtn, marginRight: 0 }}
                                onClick={clearHistory}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {history.length === 0 ? (
                        <div style={{ padding: "32px", textAlign: "center", color: "rgba(226,245,235,0.3)", fontSize: "14px" }}>
                            No deleted history
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif" }}>
                                <thead>
                                <tr>
                                    {["System", "Issue", "Battery", "Deleted At"].map(h => (
                                        <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "rgba(226,245,235,0.4)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {history.map((h, idx) => (
                                    <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                        <td style={{ padding: "12px 14px", color: "#e2f5eb", fontSize: "13px", fontWeight: 600 }}>{h.systemId}</td>
                                        <td style={{ padding: "12px 14px", color: "rgba(226,245,235,0.65)", fontSize: "13px" }}>{h.issue}</td>
                                        <td style={{ padding: "12px 14px", color: "#4ade80", fontSize: "13px" }}>{h.battery}%</td>
                                        <td style={{ padding: "12px 14px", color: "rgba(226,245,235,0.4)", fontSize: "12px" }}>{new Date(h.deletedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(226,245,235,0.25); }
        select option { background: #0a2012; color: #e2f5eb; }
        input:focus, select:focus { border-color: rgba(74,222,128,0.45) !important; box-shadow: 0 0 0 3px rgba(74,222,128,0.1); }
      `}</style>
        </div>
    );
}