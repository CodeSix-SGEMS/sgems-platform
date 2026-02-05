import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout'; // Import Layout

function App() {
    return (
        <Router>
            {/* Wrap everything in Layout */}
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;