# ⚡ TaskFlow PRO

### 🚀 Premium MERN Task Management System

TaskFlow PRO is a **high-performance, premium task management application** built with the **MERN Stack**.
It features a **dual-portal system** designed for seamless collaboration between **Administrators** and **Employees**, with real-time tracking and efficient workforce management.

---

## ✨ Core Features

### 🛠 Admin Portal

🔹 **Workforce Controls**

* ✅ Approve / Revoke employee access in real-time
* 🚫 Block / Unblock users without deleting data
* ❌ Remove employees and their task history permanently

🔹 **Task Dispatcher**

* Assign tasks with:

  * 🟢 Low Priority
  * 🟡 Medium Priority
  * 🔴 High Priority

🔹 **Live Monitoring**

* 📊 Centralized dashboard with filters
* 🔍 Track all tasks across the organization

🔹 **Analytics**

* 📈 Visual stat cards:

  * Total Staff
  * Active Members
  * Live Task Counts

---

### 👤 Employee Portal

🔹 **Department-Based Registration**

* 🏢 Register with department metadata

🔹 **Secure Access**

* 🔐 Login only after admin approval

🔹 **Personal Work Desk**

* 📋 View assigned tasks & project details

🔹 **Progress Tracking**

* Update task status:

  * ⏳ Pending
  * ⚙️ In Progress
  * ✅ Completed

---

## 🛠 Tech Stack

### 💻 Frontend

* ⚛️ React.js (Vite)
* 🎨 Tailwind CSS v4
* 🎯 Lucide React Icons
* 🔗 Axios

### ⚙️ Backend

* 🟢 Node.js
* 🚏 Express.js

### 🗄 Database

* 🍃 MongoDB (Mongoose ODM)

### 🔐 Security

* 🔑 JWT Authentication
* 🔒 BcryptJS Password Hashing
* 🛡 Protected Routes

---

## 📁 Project Structure

```bash
task-mgmt-system/
├── backend/
│   ├── config/         # DB connection
│   ├── models/         # Schemas
│   ├── routes/         # API routes
│   └── server.js       # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Pages
│   │   ├── services/   # API layer
│   │   └── index.css   # Tailwind styles
```

---

## ⚙️ Installation & Setup

### 🔹 Prerequisites

* Node.js (v18+)
* MongoDB (Local / Atlas)
* Git

---

### 🧩 Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Run server:

```bash
npm run dev
```

📌 *Default Admin will be automatically created on first run.*

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Default Admin Credentials

```txt
Email: admin@system.com
Password: admin123
```

---

## 🛡 Security & Reliability

* 🔐 **Auth Guard** – Role-based protected routes
* 🔗 **Axios Interceptors** – Auto-attach JWT token
* 🚫 **Blocking Logic** – Prevent blocked users login
* 📱 **Responsive UI** – Optimized for all devices

---

## 🌟 Highlights

✔ Clean UI with modern design
✔ Real-time workforce control
✔ Scalable architecture
✔ Production-ready structure

---

## 👨‍💻 Built With ❤️

Developed using the **MERN Stack** for performance, scalability, and modern web standards.

---

⭐ *If you like this project, give it a star!*
