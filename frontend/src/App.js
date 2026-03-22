import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // <--- Import Navigate
import Dashboard from './pages/Dashboard';
import Login from './modules/core/Login';
import AdminDashboard from './modules/core/AdminDashboard';
import Layout from './components/Layout';
import MyDevices from './modules/core/MyDevices';
import LandingPage from './modules/core/LandingPage';
//import BillingPage from "./modules/billing/BillingPage";// <--- Import
import Register from './modules/core/Register';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import Inventory from './modules/inventory/Inventory'; // <--- Import
import Reports from './modules/core/Reports';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

                </Routes>
            </Layout>
            {/* --- 2. ADD THE POPUP CONTAINER HERE --- */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </Router>
    );
}
export default App;