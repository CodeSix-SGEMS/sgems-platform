import React from 'react';
import { Link } from 'react-router-dom';
import { FaSolarPanel, FaLeaf, FaChartLine } from 'react-icons/fa';

function LandingPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <header className="bg-success text-white text-center py-5">
                <div className="container py-5">
                    <h1 className="display-3 fw-bold mb-3">GreenGrid SGEMS</h1>
                    <p className="lead mb-4">Smart Green Energy Management System for the Modern World.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/login" className="btn btn-light btn-lg px-4 text-success fw-bold">Login</Link>
                        <Link to="/register" className="btn btn-outline-light btn-lg px-4 fw-bold">Get Started</Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <div className="container py-5">
                <div className="row text-center g-4">
                    <div className="col-md-4">
                        <div className="mb-3 text-success"><FaSolarPanel size={50} /></div>
                        <h3>Device Management</h3>
                        <p className="text-muted">Connect and monitor your solar panels, inverters, and smart meters in real-time.</p>
                    </div>
                    <div className="col-md-4">
                        <div className="mb-3 text-success"><FaChartLine size={50} /></div>
                        <h3>Live Analytics</h3>
                        <p className="text-muted">Track your energy generation and consumption with beautiful interactive charts.</p>
                    </div>
                    <div className="col-md-4">
                        <div className="mb-3 text-success"><FaLeaf size={50} /></div>
                        <h3>Eco-Friendly</h3>
                        <p className="text-muted">Optimize your carbon footprint and save money with smart insights.</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white text-center py-3">
                <p className="mb-0">&copy; 2026 Jayasuriya Technologies. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;