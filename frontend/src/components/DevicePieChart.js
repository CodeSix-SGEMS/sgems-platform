import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// GreenGrid palette — forest greens + gold accent + muted tones
const COLORS = ['#2d5a3d', '#c9a84c', '#5a8a6a', '#a8d5b5', '#8b6f4e'];

const CustomTooltip = ({ active, payload }) => {
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
            <p style={{ margin: '0 0 4px', fontWeight: 500, color: '#1a3a2a' }}>
                {payload[0].name}
            </p>
            <p style={{ margin: 0, color: payload[0].payload.fill, fontWeight: 600 }}>
                {payload[0].value.toFixed(2)} kWh
            </p>
        </div>
    );
};

const CustomLegend = ({ payload }) => (
    <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '10px 18px',
        marginTop: '12px',
        fontFamily: "'DM Sans', sans-serif",
    }}>
        {payload.map((entry, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                    width: 10, height: 10,
                    borderRadius: '50%',
                    background: entry.color,
                    flexShrink: 0,
                }} />
                <span style={{ fontSize: 12, color: '#5a8a6a', fontWeight: 400 }}>
                    {entry.value}
                </span>
            </div>
        ))}
    </div>
);

const DevicePieChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="45%"
                    innerRadius={68}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default DevicePieChart;