import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = { email, password };

        try {
            // 1. Send data to Spring Boot Backend
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            // 2. Check if Backend said "OK"
            if (response.ok) {
                const data = await response.json();
                console.log("Login Success:", data);

                // Optional: Save user info to browser storage so they stay logged in
                localStorage.setItem('userRole', data.role);

                alert("Login Successful! Welcome " + data.fullName);
                navigate('/'); // Redirect to Dashboard
            } else {
                alert("Login Failed: Invalid Email or Password");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Server Error: Is the Backend running?");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: '400px' }}>
                <div className="card-body">
                    <h3 className="text-center mb-4 text-primary">SGEMS Login</h3>
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
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Sign In</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;