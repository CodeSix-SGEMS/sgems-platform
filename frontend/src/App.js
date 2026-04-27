import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './modules/core/Login';
import AdminDashboard from './modules/core/AdminDashboard';
import Layout from './components/Layout';
import MyDevices from './modules/core/MyDevices';
import LandingPage from './modules/core/LandingPage';
import Maintenance from './modules/maintenance/Maintenance';
import Billing from './modules/billing/Billing';
import Register from './modules/core/Register';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import Inventory from './modules/inventory/Inventory';
import Reports from './modules/core/Reports';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alerts from "./modules/alerts/Alerts";
import Settings from "./modules/core/Settings";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    {/* --- PUBLIC ROUTES --- */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* --- PROTECTED APP ROUTES --- */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
                    } />

                    <Route path="/devices" element={
                        <ProtectedRoute><MyDevices /></ProtectedRoute>
                    } />

                    {/* Your Teammate's Route */}
                    <Route path="/inventory" element={
                        <ProtectedRoute><Inventory /></ProtectedRoute>
                    } />

                    {/* The Shared Reporting Route */}
                    <Route path="/reports" element={
                        <ProtectedRoute><Reports /></ProtectedRoute>
                    } />

                    <Route path="/maintenance" element={
                        <ProtectedRoute><Maintenance /></ProtectedRoute>
                    } />

                    <Route path="/billing" element={
                        <ProtectedRoute><Billing /></ProtectedRoute>
                    } />

                    <Route path="/alerts" element={
                        <ProtectedRoute><Alerts /></ProtectedRoute>
                    } />

                    <Route path="/settings" element={<Settings />} />

                    <Route path="/maintenance" element={<Maintenance />} />

                </Routes>
            </Layout>
            {/* --- 2. ADD THE POPUP CONTAINER HERE --- */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </Router>
    );
}
export default App;