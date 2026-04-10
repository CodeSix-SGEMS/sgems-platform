import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Background, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import { FaHome, FaSolarPanel, FaBatteryThreeQuarters, FaBroadcastTower, FaMoon, FaSun } from 'react-icons/fa';

// ✅ NOTICE THE PROPS HERE!
export default function EnergyFlowChart({ solarKw = 0, consumptionKw = 0, batteryPct = 0, gridKw = 0 }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        const bg = isDarkMode ? '#2a2a2a' : '#ffffff';
        const textColor = isDarkMode ? '#ffffff' : '#1a3a2a';
        const textMuted = isDarkMode ? '#aaaaaa' : '#6a8a78';
        const borderColor = isDarkMode ? '1px solid #444' : '1px solid rgba(168,213,181,0.4)';
        const shadow = isDarkMode ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(26,58,42,0.06)';

        const greenAccent = isDarkMode ? '#a8d5b5' : '#2d5a3d';
        const goldAccent = isDarkMode ? '#c9a84c' : '#b08f33';
        const hubBorder = isDarkMode ? '#5a8a6a' : '#2d5a3d';

        const nodeStyle = {
            background: bg, color: textColor, border: borderColor,
            borderRadius: '16px', padding: '16px', width: '140px',
            textAlign: 'center', boxShadow: shadow, fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.3s ease'
        };

        const hubStyle = {
            ...nodeStyle, border: `2px solid ${hubBorder}`, borderRadius: '50%',
            width: '110px', height: '110px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '10px'
        };

        // ✅ REPLACED HARDCODED NUMBERS WITH THE PROPS
        setNodes([
            {
                id: 'hub', position: { x: 300, y: 160 }, style: hubStyle,
                data: {
                    label: (
                        <>
                            <FaHome style={{ fontSize: '28px', color: greenAccent, marginBottom: '4px' }}/>
                            <div style={{ fontSize: '10px', color: textMuted, letterSpacing: '1px' }}>HOME HUB</div>
                        </>
                    )
                }
            },
            {
                id: 'solar', position: { x: 285, y: 10 }, style: nodeStyle,
                data: {
                    label: (
                        <>
                            <FaSolarPanel style={{ fontSize: '24px', color: greenAccent, marginBottom: '8px' }}/>
                            <div style={{ fontSize: '10px', color: textMuted, letterSpacing: '1px', textTransform: 'uppercase' }}>Solar Panels</div>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: greenAccent, marginTop: '4px' }}>{solarKw} kW</div>
                        </>
                    )
                }
            },
            {
                id: 'consumption', position: { x: 285, y: 310 }, style: nodeStyle,
                data: {
                    label: (
                        <>
                            <FaHome style={{ fontSize: '24px', color: goldAccent, marginBottom: '8px' }}/>
                            <div style={{ fontSize: '10px', color: textMuted, letterSpacing: '1px', textTransform: 'uppercase' }}>Consumption</div>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: textColor, marginTop: '4px' }}>{consumptionKw} kW</div>
                        </>
                    )
                }
            },
            {
                id: 'grid', position: { x: 50, y: 160 }, style: nodeStyle,
                data: {
                    label: (
                        <>
                            <FaBroadcastTower style={{ fontSize: '24px', color: goldAccent, marginBottom: '8px' }}/>
                            <div style={{ fontSize: '10px', color: textMuted, letterSpacing: '1px', textTransform: 'uppercase' }}>Grid</div>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: textMuted, marginTop: '4px' }}>{gridKw} kW</div>
                        </>
                    )
                }
            },
            {
                id: 'battery', position: { x: 520, y: 160 }, style: nodeStyle,
                data: {
                    label: (
                        <>
                            <FaBatteryThreeQuarters style={{ fontSize: '24px', color: greenAccent, marginBottom: '8px' }}/>
                            <div style={{ fontSize: '10px', color: textMuted, letterSpacing: '1px', textTransform: 'uppercase' }}>Battery</div>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: greenAccent, marginTop: '4px' }}>{batteryPct}%</div>
                        </>
                    )
                }
            }
        ]);

        // ✅ DYNAMIC ANIMATIONS (stops animating if power is 0)
        setEdges([
            { id: 'e-solar-hub', source: 'solar', target: 'hub', type: 'straight', animated: solarKw > 0, style: { stroke: greenAccent, strokeWidth: 2 } },
            { id: 'e-grid-hub', source: 'grid', target: 'hub', type: 'straight', animated: gridKw > 0, style: { stroke: isDarkMode ? '#444' : '#ccc', strokeWidth: 2 } },
            { id: 'e-hub-battery', source: 'hub', target: 'battery', type: 'straight', animated: true, style: { stroke: greenAccent, strokeWidth: 2 } },
            { id: 'e-hub-consumption', source: 'hub', target: 'consumption', type: 'straight', animated: consumptionKw > 0, style: { stroke: goldAccent, strokeWidth: 2 } },
        ]);

        // ✅ ADDED DEPENDENCIES SO IT REDRAWS WHEN DATA CHANGES
    }, [isDarkMode, solarKw, consumptionKw, batteryPct, gridKw]);

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

    const containerBg = isDarkMode ? '#1e1e1e' : '#fdfaf5';
    const headerBorder = isDarkMode ? '1px solid #333' : '1px solid rgba(168,213,181,0.3)';
    const titleColor = isDarkMode ? '#fff' : '#1a3a2a';
    const subtitleColor = isDarkMode ? '#aaa' : '#6a8a78';
    const gridDotColor = isDarkMode ? '#333' : '#e0e5e2';

    return (
        <div className="card shadow-sm mb-4" style={{ background: containerBg, border: headerBorder, borderRadius: '18px', overflow: 'hidden', transition: 'all 0.3s ease' }}>
            <div className="card-header d-flex justify-content-between align-items-center" style={{ background: containerBg, borderBottom: headerBorder, padding: '16px 24px', transition: 'all 0.3s ease' }}>
                <h5 className="mb-0" style={{ fontSize: '15px', color: subtitleColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Energy Flow <span style={{ color: titleColor, fontWeight: 'bold', textTransform: 'none' }}>System Overview</span>
                </h5>

                <div className="d-flex align-items-center gap-3">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        style={{ background: 'transparent', border: 'none', color: isDarkMode ? '#c9a84c' : '#6a8a78', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? <FaSun /> : <FaMoon />}
                    </button>

                    <span style={{ background: 'rgba(45,90,61,0.15)', color: '#2d5a3d', border: '1px solid rgba(45,90,61,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        ● Live
                    </span>
                </div>
            </div>

            <div className="card-body p-0" style={{ width: '100%', height: '420px', background: containerBg, transition: 'all 0.3s ease' }}>
                <ReactFlow
                    nodes={nodes} edges={edges}
                    onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                    nodesDraggable={false} panOnDrag={false} zoomOnScroll={false} zoomOnDoubleClick={false}
                    fitView fitViewOptions={{ padding: 0.2 }} attributionPosition="bottom-right"
                >
                    <Background color={gridDotColor} gap={20} size={1} />
                </ReactFlow>
            </div>
        </div>
    );
}