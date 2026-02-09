# 🌱 GreenGrid: Smart Green Energy Management System (SGEMS)

> **Power Your Future With Intelligence.** > A distributed full-stack platform for monitoring, managing, and optimizing renewable energy assets.

![Project Status](https://img.shields.io/badge/Status-Development-green)
![Tech Stack](https://img.shields.io/badge/Stack-Spring%20Boot%20%7C%20React%20%7C%20MySQL-blue)

---

## 🏗️ Project Architecture (Modular Design)

To prevent merge conflicts and ensure clean code, this project follows a **Strict Modular Architecture**.
**Every developer owns a specific directory.** Do not edit files outside your assigned module without permission.

### 📂 Frontend (`frontend/src/modules/`)

| Module | Owner | Path | Responsibility |
| :--- | :--- | :--- | :--- |
| **Core** | **Sushen (Admin)** | `src/modules/core/` | Auth, Admin Dashboard, My Devices, Landing Page. |
| **Inventory** | **Senithu** | `src/modules/inventory/` | Stock levels, Asset tracking, Warehouse forms. |
| **Billing** | **Muditha** | `src/modules/billing/` | Invoice generation, Tariff calculation, Payment history. |
| **Maintenance** | **Sehath** | `src/modules/maintenance/` | Ticketing system, Technician scheduling. |
| **Alerts** | **Kavidu** | `src/modules/alerts/` | System warnings, Voltage anomaly logs. |

> **⚠️ CRITICAL:** Do NOT edit `App.js` or `Sidebar.js`. If you need a new route, ask Sushen.

### ☕ Backend (`backend/src/.../controller/`)

| Package | Owner | Path | API Endpoints |
| :--- | :--- | :--- | :--- |
| **Core** | **Sushen** | `controller.core` | `/auth`, `/users`, `/devices` |
| **Inventory** | **Senithu** | `controller.inventory` | `/api/inventory` |
| **Billing** | **Muditha** | `controller.billing` | `/api/billing` |
| **Maintenance** | **Sehath** | `controller.maintenance` | `/api/tickets` |
| **Alerts** | **Kavidu** | `controller.alerts` | `/api/alerts` |

---

## 🚀 Setup & Installation

### Prerequisites
* **Java JDK 17+**
* **Node.js 18+**
* **MySQL Server** (Running on port 3306)

### 1. Database Setup
Create a MySQL database named `sgems_db`. The Spring Boot app will automatically create the tables (`ddl-auto=update`).

### 2. Backend (Spring Boot)
```bash
cd backend
# Update application.properties with your MySQL password
./mvnw spring-boot:run