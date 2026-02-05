import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function EnergyChart() {
    // Simulated Data: 7 Days of Energy Usage
    const data = [
        { day: 'Mon', Generated: 40, Consumed: 24 },
        { day: 'Tue', Generated: 30, Consumed: 18 },
        { day: 'Wed', Generated: 20, Consumed: 35 }, // Cloudy day!
        { day: 'Thu', Generated: 27, Consumed: 20 },
        { day: 'Fri', Generated: 58, Consumed: 29 }, // Sunny day!
        { day: 'Sat', Generated: 63, Consumed: 30 },
        { day: 'Sun', Generated: 60, Consumed: 25 },
    ];

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Generated" stroke="#28a745" strokeWidth={3} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Consumed" stroke="#dc3545" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default EnergyChart;