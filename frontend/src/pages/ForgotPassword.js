import React from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4 text-center" style={{ width: '400px' }}>
                <h4 className="mb-3">Reset Password</h4>
                <p className="text-muted mb-4">
                    Contact your System Administrator to reset your credentials, or try creating a new account.
                </p>
                <div className="d-grid gap-2">
                    <Link to="/login" className="btn btn-primary">Back to Login</Link>
                    <Link to="/register" className="btn btn-outline-secondary">Create New Account</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;