import React from 'react';

function Inventory() {
    return (
        <div className="container-fluid">
            <h2 className="mb-4">Inventory & Asset Management</h2>
            <div className="alert alert-info">
                <strong>Module Assigned to:</strong> [Teammate Name]
            </div>

            <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                    <h4 className="text-muted mb-3">Warehouse Stock Management</h4>
                    <p>This module will track solar panel stock, supplier warranties, and procurement.</p>
                    <button className="btn btn-outline-secondary disabled">Add Stock Item (Coming Soon)</button>
                </div>
            </div>
        </div>
    );
}

export default Inventory;