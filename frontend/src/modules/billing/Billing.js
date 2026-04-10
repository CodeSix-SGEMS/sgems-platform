import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:8080/api";

export default function BillingPage() {
    const { user } = useContext(AuthContext);

    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);


    const [createForm, setCreateForm] = useState({ userId: "", unitsConsumed: "" });


    const [editModal, setEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ id: null, userId: "", unitsConsumed: "" });


    const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

    useEffect(() => {
        loadInvoices();
        loadPayments();
        loadUsers();
    }, []);

    const loadInvoices = async (start, end) => {
        try {
            const params = start && end ? { start, end } : {};
            const res = await axios.get(`${API}/invoices`, { params });
            setInvoices(res.data);
        } catch (err) {
            console.error("Failed to load invoices", err);
        }
    };

    const loadPayments = async () => {
        try {
            const res = await axios.get(`${API}/payments`);
            setPayments(res.data);
        } catch (err) {
            console.error("Failed to load payments", err);
        }
    };

    const loadUsers = async () => {
        try {
            const res = await axios.get(`${API}/users`);
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to load users", err);
        }
    };

    const handleCreate = async () => {
        if (!createForm.userId || !createForm.unitsConsumed) return;
        try {
            await axios.post(`${API}/invoices`, {
                userId: parseInt(createForm.userId),
                unitsConsumed: parseFloat(createForm.unitsConsumed),
            });
            setCreateForm({ userId: "", unitsConsumed: "" });
            loadInvoices();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create invoice");
        }
    };

    const handleEdit = (inv) => {
        setEditForm({
            id: inv.id,
            userId: inv.user.id,
            unitsConsumed: inv.unitsConsumed,
        });
        setEditModal(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${API}/invoices/${editForm.id}`, {
                userId: parseInt(editForm.userId),
                unitsConsumed: parseFloat(editForm.unitsConsumed),
            });
            setEditModal(false);
            loadInvoices();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update invoice");
        }
    };

    const handlePay = async (inv) => {
        try {
            await axios.put(`${API}/invoices/pay/${inv.id}`, { method: "CARD" });
            loadInvoices();
            loadPayments();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to pay invoice");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this invoice?")) return;
        try {
            await axios.delete(`${API}/invoices/${id}`);
            loadInvoices();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete invoice");
        }
    };

    const handleDateFilter = () => {
        if (dateFilter.start && dateFilter.end) {
            loadInvoices(dateFilter.start, dateFilter.end);
        }
    };

    const handleClearFilter = () => {
        setDateFilter({ start: "", end: "" });
        loadInvoices();
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4">💰 Billing Management</h2>

            {/* ── Date Filter ── */}
            <div className="card shadow-sm mb-4">
                <div className="card-header">Filter by Date Range</div>
                <div className="card-body row g-3 align-items-end">
                    <div className="col-md-4">
                        <label className="form-label small">From</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dateFilter.start}
                            onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label small">To</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dateFilter.end}
                            onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                        />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary w-100" onClick={handleDateFilter}>
                            Filter
                        </button>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-outline-secondary w-100" onClick={handleClearFilter}>
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Generate Invoice ── */}
            <div className="card shadow-sm mb-4">
                <div className="card-header">Generate Invoice</div>
                <div className="card-body row g-3">
                    <div className="col-md-5">
                        <select
                            className="form-select"
                            value={createForm.userId}
                            onChange={(e) => setCreateForm({ ...createForm, userId: e.target.value })}
                        >
                            <option value="">Select Customer</option>
                            {users
                                .filter((u) => u.role === "USER")
                                .map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.fullName} ({u.email})
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="col-md-5">
                        <input
                            className="form-control"
                            type="number"
                            placeholder="Units Consumed (kWh)"
                            value={createForm.unitsConsumed}
                            onChange={(e) => setCreateForm({ ...createForm, unitsConsumed: e.target.value })}
                        />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-success w-100" onClick={handleCreate}>
                            Generate
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Invoices Table ── */}
            <div className="card shadow-sm mb-4">
                <div className="card-header">Invoices</div>
                <div className="card-body">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Units (kWh)</th>
                            <th>Total (LKR)</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoices.map((inv) => (
                            <tr key={inv.id}>
                                <td>{inv.id}</td>
                                <td>{inv.user?.fullName}</td>
                                <td>{inv.unitsConsumed}</td>
                                <td>LKR {inv.totalAmount?.toFixed(2)}</td>
                                <td>{inv.invoiceDate}</td>
                                <td>
                                        <span className={`badge ${inv.status === "PAID" ? "bg-success" : "bg-warning text-dark"}`}>
                                            {inv.status}
                                        </span>
                                </td>
                                <td>
                                    {inv.status === "PENDING" && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-primary me-1"
                                                onClick={() => handlePay(inv)}
                                            >
                                                Pay
                                            </button>
                                            <button
                                                className="btn btn-sm btn-warning me-1"
                                                onClick={() => handleEdit(inv)}
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(inv.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {invoices.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center text-muted">No invoices found</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Payment History ── */}
            <div className="card shadow-sm">
                <div className="card-header">Payment History</div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Invoice ID</th>
                            <th>Customer</th>
                            <th>Amount (LKR)</th>
                            <th>Method</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {payments.map((pay) => (
                            <tr key={pay.id}>
                                <td>{pay.id}</td>
                                <td>{pay.invoice?.id}</td>
                                <td>{pay.invoice?.user?.fullName}</td>
                                <td>LKR {pay.amount?.toFixed(2)}</td>
                                <td>{pay.method}</td>
                                <td>{pay.paymentDate}</td>
                            </tr>
                        ))}
                        {payments.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center text-muted">No payments recorded</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Edit Modal ── */}
            {editModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Invoice #{editForm.id}</h5>
                                <button className="btn-close" onClick={() => setEditModal(false)} />
                            </div>
                            <div className="modal-body row g-3">
                                <div className="col-12">
                                    <label className="form-label">Customer</label>
                                    <select
                                        className="form-select"
                                        value={editForm.userId}
                                        onChange={(e) => setEditForm({ ...editForm, userId: e.target.value })}
                                    >
                                        {users
                                            .filter((u) => u.role === "USER")
                                            .map((u) => (
                                                <option key={u.id} value={u.id}>
                                                    {u.fullName} ({u.email})
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Units Consumed (kWh)</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        value={editForm.unitsConsumed}
                                        onChange={(e) => setEditForm({ ...editForm, unitsConsumed: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setEditModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleUpdate}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}