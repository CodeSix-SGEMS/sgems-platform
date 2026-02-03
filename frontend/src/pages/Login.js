import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // TODO: Connect this to Spring Boot Backend later
        console.log("Logging in with:", email, password);

        // For now, let's simulate a successful login
        if(email && password) {
            navigate('/'); // Redirect to Dashboard
        } else {
            alert("Please enter both email and password");
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
                                placeholder="admin@greengrid.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Sign In</button>
                        </div>
                    </form>
                    <div className="text-center mt-3">
                        <small className="text-muted">Forgot password? Contact IT Support.</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;