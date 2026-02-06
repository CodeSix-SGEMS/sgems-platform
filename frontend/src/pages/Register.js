import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Default role is USER for self-registration
        const payload = { ...formData, role: 'USER' };

        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Registration Successful! Please Login.");
                navigate('/login');
            } else {
                alert("Registration Failed. Email might be taken.");
            }
        } catch (error) {
            alert("Server Error");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: '400px' }}>
                <h3 className="text-center text-success mb-4">Join GreenGrid</h3>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-control"
                               onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control"
                               onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control"
                               onChange={e => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn btn-success w-100 mb-3">Create Account</button>
                    <div className="text-center">
                        <small>Already have an account? <Link to="/login">Login here</Link></small>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;