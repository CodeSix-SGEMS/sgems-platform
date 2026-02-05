import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext'; // <--- Import this

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* Wrap App inside AuthProvider */}
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);