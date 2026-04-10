import React, { useState } from "react";

const Maintenance = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        id: null,
        title: "",
        description: "",
        status: "Pending",
        scheduled_date: ""
    });
    const [isEditing, setIsEditing] = useState(false);

    // Handle input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add or Update
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            setItems(items.map(item => item.id === form.id ? form : item));
            setIsEditing(false);
        } else {
            setItems([...items, { ...form, id: Date.now() }]);
        }

        setForm({
            id: null,
            title: "",
            description: "",
            status: "Pending",
            scheduled_date: ""
        });
    };

    // Edit
    const handleEdit = (item) => {
        setForm(item);
        setIsEditing(true);
    };

    // Delete
    const handleDelete = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Maintenance Management</h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                />

                <select name="status" value={form.status} onChange={handleChange}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>

                <input
                    type="date"
                    name="scheduled_date"
                    value={form.scheduled_date}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    {isEditing ? "Update" : "Add"}
                </button>
            </form>

            {/* TABLE */}
            <table border="1" cellPadding="10" width="100%">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {items.length === 0 ? (
                    <tr>
                        <td colSpan="5" align="center">No records</td>
                    </tr>
                ) : (
                    items.map(item => (
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.description}</td>
                            <td>{item.status}</td>
                            <td>{item.scheduled_date}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default Maintenance;