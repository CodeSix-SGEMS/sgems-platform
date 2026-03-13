import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Custom tooltip styled to match GreenGrid aesthetic
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
        <div style={{
            background: 'rgba(253,250,245,0.97)',
            border: '1px solid rgba(168,213,181,0.4)',
            borderRadius: '10px',
            padding: '10px 14px',
            boxShadow: '0 8px 24px rgba(26,58,42,0.12)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
        }}>
            <p style={{ margin: '0 0 6px', fontWeight: 500, color: '#1a3a2a', fontSize: '12px', letterSpacing: '0.5px' }}>
                {label}
            </p>
            {payload.map((entry, i) => (
                <p key={i} style={{ margin: '2px 0', color: entry.color, fontWeight: 500 }}>
                    {entry.name}: <span style={{ color: '#1a3a2a' }}>{entry.value} kWh</span>
                </p>
            ))}
        </div>
    );
};

function EnergyChart({ data }) {
    // key={data.length} forces Recharts to fully remount when the
    // dataset size changes (7 → 14 → 30 days), fixing stale axis scaling.
    return (
        <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
                <LineChart
                    key={data.length}
                    data={data}
                    margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,213,181,0.25)" vertical={false} />
                    <XAxis
                        dataKey="day"
                        tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fill: '#7a9688' }}
                        axisLine={{ stroke: 'rgba(168,213,181,0.3)' }}
                        tickLine={false}
                        // Show fewer ticks so labels don't overlap on 30-day view
                        interval={data.length > 14 ? 4 : data.length > 7 ? 1 : 0}
                    />
                    <YAxis
                        tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fill: '#7a9688' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}`}
                        width={36}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '12px',
                            paddingTop: '12px',
                            color: '#5a8a6a'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="generated"
                        stroke="#2d5a3d"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#2d5a3d', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#2d5a3d', stroke: '#a8d5b5', strokeWidth: 2 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="consumed"
                        stroke="#c9a84c"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#c9a84c', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#c9a84c', stroke: '#f5f0e8', strokeWidth: 2 }}
                        strokeDasharray="5 3"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default EnergyChart;