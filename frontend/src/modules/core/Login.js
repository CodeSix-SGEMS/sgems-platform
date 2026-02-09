import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <--- Import Link
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = { email, password };

        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                login(data);
                toast.success("Login Successful! Welcome back.");
                navigate('/dashboard');
            } else {
                toast.error("Invalid Credentials. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server Error: Is the Backend running?");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: '400px' }}>
                <div className="card-body">
                    <h3 className="text-center mb-4 text-primary fw-bold">SGEMS Login</h3>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div className="d-flex justify-content-end mb-3">
                            <Link to="/forgot-password" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <div className="d-grid mb-3">
                            <button type="submit" className="btn btn-primary">Sign In</button>
                        </div>

                        {/* Create Account Link */}
                        <div className="text-center">
                            <span className="text-muted">Don't have an account? </span>
                            <Link to="/register" className="fw-bold" style={{ textDecoration: 'none' }}>
                                Create one
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;