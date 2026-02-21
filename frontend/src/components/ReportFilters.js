import React, { useState } from 'react';
import { FaFilter, FaDownload, FaSync } from 'react-icons/fa';

const ReportFilters = ({ onGenerateReport }) => {
    const [dateRange, setDateRange] = useState('7');
    const [reportType, setReportType] = useState('all');
    const [format, setFormat] = useState('pdf');
    const [customDateFrom, setCustomDateFrom] = useState('');
    const [customDateTo, setCustomDateTo] = useState('');
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        setGenerating(true);

        const filters = {
            dateRange,
            reportType,
            format,
            customDateFrom: dateRange === 'custom' ? customDateFrom : null,
            customDateTo: dateRange === 'custom' ? customDateTo : null
        };

        await onGenerateReport(filters);
        setGenerating(false);
    };

    const handleReset = () => {
        setDateRange('7');
        setReportType('all');
        setFormat('pdf');
        setCustomDateFrom('');
        setCustomDateTo('');
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
                <FaFilter className="me-2" />
                Report Filters & Customization
            </div>
            <div className="card-body">
                <div className="row g-3">
                    {/* Date Range Selector */}
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Date Range</label>
                        <select
                            className="form-select"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="14">Last 14 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>

                    {/* Report Type Selector */}
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Report Type</label>
                        <select
                            className="form-select"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <option value="all">All Reports</option>
                            <option value="energy">Energy Generation</option>
                            <option value="users">User Directory</option>
                            <option value="devices">Device Health</option>
                            <option value="financial">Financial Summary</option>
                        </select>
                    </div>

                    {/* Format Selector */}
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Export Format</label>
                        <select
                            className="form-select"
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                        >
                            <option value="pdf">PDF Document</option>
                            <option value="excel">Excel Spreadsheet</option>
                            <option value="csv">CSV File</option>
                        </select>
                    </div>

                    {/* Custom Date Range (shows only when 'custom' is selected) */}
                    {dateRange === 'custom' && (
                        <>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">From Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={customDateFrom}
                                    onChange={(e) => setCustomDateFrom(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">To Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={customDateTo}
                                    onChange={(e) => setCustomDateTo(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="col-12">
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-success"
                                onClick={handleGenerate}
                                disabled={generating}
                            >
                                {generating ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <FaDownload className="me-2" />
                                        Generate Report
                                    </>
                                )}
                            </button>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={handleReset}
                            >
                                <FaSync className="me-2" />
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Summary */}
                <div className="alert alert-info mt-3 mb-0">
                    <small>
                        <strong>Current Selection:</strong> {reportType === 'all' ? 'All Reports' : reportType.charAt(0).toUpperCase() + reportType.slice(1)} report
                        {' '}- {dateRange === 'custom' ? `${customDateFrom} to ${customDateTo}` : `Last ${dateRange} days`}
                        {' '}- Format: {format.toUpperCase()}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default ReportFilters;