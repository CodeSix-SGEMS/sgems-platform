import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Now accepts 'data' directly
function EnergyChart({ data }) {
    return (
        <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="generated" stroke="#28a745" strokeWidth={3} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="consumed" stroke="#dc3545" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default EnergyChart;