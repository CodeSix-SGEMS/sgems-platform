import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:8080/api";

export default function UserBillingPage() {
    const { user } = useContext(AuthContext);

    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            loadInvoices();
            loadPayments();
        }
    }, [user]);

    const loadInvoices = async (start, end) => {
        setLoading(true);
        try {
            const params = start && end ? { start, end } : {};
            const res = await axios.get(`${API}/invoices/user/${user.id}`, { params });
            setInvoices(res.data);
        } catch (err) {
            console.error("Failed to load invoices", err);
        } finally {
            setLoading(false);
        }
    };

    const loadPayments = async () => {
        try {
            const res = await axios.get(`${API}/payments/user/${user.id}`);
            setPayments(res.data);
        } catch (err) {
            console.error("Failed to load payments", err);
        }
    };

    const handleFilter = () => {
        if (dateFilter.start && dateFilter.end) {
            loadInvoices(dateFilter.start, dateFilter.end);
        }
    };

    const handleClear = () => {
        setDateFilter({ start: "", end: "" });
        loadInvoices();
    };

    // Summary calculations
    const totalBilled = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const totalPaid = invoices
        .filter((inv) => inv.status === "PAID")
        .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const totalPending = invoices
        .filter((inv) => inv.status === "PENDING")
        .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-1">My Billing</h2>
            <p className="text-muted mb-4">Welcome, {user?.fullName}. Here is your billing history.</p>

            {/* ── Summary Cards ── */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm text-center p-3">
                        <div className="text-muted small">Total Billed</div>
                        <div className="fs-4 fw-bold">LKR {totalBilled.toFixed(2)}</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm text-center p-3 border-success">
                        <div className="text-muted small">Total Paid</div>
                        <div className="fs-4 fw-bold text-success">LKR {totalPaid.toFixed(2)}</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm text-center p-3 border-warning">
                        <div className="text-muted small">Pending</div>
                        <div className="fs-4 fw-bold text-warning">LKR {totalPending.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            {/* ── Date Range Filter ── */}
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
                        <button className="btn btn-primary w-100" onClick={handleFilter}>
                            Filter
                        </button>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-outline-secondary w-100" onClick={handleClear}>
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Invoice History ── */}
            <div className="card shadow-sm mb-4">
                <div className="card-header">Invoice History</div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-3 text-muted">Loading...</div>
                    ) : (
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                            <tr>
                                <th>Invoice #</th>
                                <th>Units (kWh)</th>
                                <th>Amount (LKR)</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoices.map((inv) => (
                                <tr key={inv.id}>
                                    <td>#{inv.id}</td>
                                    <td>{inv.unitsConsumed}</td>
                                    <td>LKR {inv.totalAmount?.toFixed(2)}</td>
                                    <td>{inv.invoiceDate}</td>
                                    <td>
                                            <span className={`badge ${inv.status === "PAID" ? "bg-success" : "bg-warning text-dark"}`}>
                                                {inv.status}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            {invoices.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        No invoices found for the selected period
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ── Payment History ── */}
            <div className="card shadow-sm">
                <div className="card-header">Payment History</div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead className="table-light">
                        <tr>
                            <th>Invoice #</th>
                            <th>Amount (LKR)</th>
                            <th>Method</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {payments.map((pay) => (
                            <tr key={pay.id}>
                                <td>#{pay.invoice?.id}</td>
                                <td>LKR {pay.amount?.toFixed(2)}</td>
                                <td>{pay.method}</td>
                                <td>{pay.paymentDate}</td>
                            </tr>
                        ))}
                        {payments.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center text-muted">
                                    No payments recorded
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}