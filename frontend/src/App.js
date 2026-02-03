import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
    return (
        <Router>
            {/* The Navbar is outside Routes so it shows on every page */}
            <Navbar />

            <Routes>
                <Route path="/" element={<Dashboard />} />
                {/* We will add <Route path="/login" ... /> later */}
            </Routes>
        </Router>
    );
}

export default App;