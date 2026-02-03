import React from 'react';

function Dashboard() {
    return (
        <div className="container mt-5">
            <div className="card text-center">
                <div className="card-header">
                    Welcome to SGEMS
                </div>
                <div className="card-body">
                    <h5 className="card-title">System Status: Online</h5>
                    <p className="card-text">Your backend is connected and running.</p>
                    <button className="btn btn-primary">View Analytics</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;