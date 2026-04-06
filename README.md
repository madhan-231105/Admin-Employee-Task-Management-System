⚡ TaskFlow PRO - Premium MERN Task Management System

TaskFlow PRO is a high-performance, premium-designed task management application built with the MERN Stack. It offers a dual-portal system specifically designed for seamless coordination between Administrators and Employees, featuring real-time task tracking and advanced workforce management.
🎨 Design Philosophy & Palette

The application uses a custom Glassmorphism aesthetic with a high-contrast dark theme:

    Slate (#262626): Deep primary background.

    Secondhand Grey (#3f3f3f): Frosted glass card surfaces.

    Whitish (#f5f5f5): Primary typography and high-impact elements.

    Accent (#c8a97e): Premium gold/tan highlights for actions and branding.

    System Colors: Success (#6fcf97), Warning (#f2994a), Danger (#eb5757), and Info (#a8c4dc).

🚀 Core Features
🛠 Administrative Portal

    Workforce Controls:

        Approve/Revoke: Manage employee access in real-time.

        Block/Unblock: Instantly restrict login access without deleting data.

        Remove: Permanently delete employees and their associated task history.

    Task Dispatcher: Assign tasks with detailed descriptions and three priority levels (Low, Medium, High).

    Live Monitoring: Track all organizational tasks through a centralized, filterable dashboard.

    Analytics: Visual stat cards showing total staff, active members, and live task counts.

👤 Employee Portal

    Departmental Registration: Employees can sign up with specific department metadata.

    Secure Access: Access is restricted until an Administrator verifies and approves the account.

    Personal Work Desk: A dedicated space to view assigned tasks and project details.

    Progress Tracking: Update task status through Pending, In Progress, and Completed pipelines.

🛠 Technology Stack

    Frontend: React.js (Vite), Tailwind CSS v4 (CSS-first config), Lucide-React Icons, Axios.

    Backend: Node.js, Express.js.

    Database: MongoDB (Mongoose ODM).

    Security: JWT (JSON Web Tokens), BcryptJS (Password Hashing), Protected Frontend Routes.

📁 Project Structure
code Text

task-mgmt-system/
├── backend/
│   ├── config/         # Database connection logic
│   ├── models/         # User & Task Mongoose Schemas
│   ├── routes/         # Auth, Admin, and Employee API routes
│   └── server.js       # Express entry point & Admin Seeding logic
├── frontend/
│   ├── src/
│   │   ├── components/ # Modal, Avatar, TaskCard, Toast UI
│   │   ├── pages/      # Login, AdminPortal, EmployeePortal
│   │   ├── services/   # Axios API instance with Auth interceptors
│   │   └── index.css   # Tailwind v4 Global Theme & Palette

⚙️ Installation & Execution
1. Prerequisites

    Node.js (v18+)

    MongoDB (Local or Atlas URI)

    Git

2. Backend Setup

    Enter the backend directory:
    code Bash

    cd backend

    Install dependencies:
    code Bash

    npm install

    Create a .env file in the backend/ folder:
    code Env

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key

    Start the server:
    code Bash

    npm run dev

    Note: The system will automatically seed the default Admin on the first run.

3. Frontend Setup

    Open a new terminal and enter the frontend directory:
    code Bash

    cd frontend

    Install dependencies:
    code Bash

    npm install

    Start the Vite development server:
    code Bash

    npm run dev

🔑 Default Admin Credentials

For initial setup, use the following credentials to access the Admin Portal:

    Email: admin@system.com

    Password: admin123

🛡 Security & Reliability

    Auth Guard: Frontend routes are protected by a ProtectedRoute component that validates user roles and tokens.

    API Interceptors: The Axios instance automatically attaches the JWT token to every request header.

    Blocking Logic: The system performs a real-time database check during login to prevent blocked users from gaining access.

    Responsive UI: The dashboard is optimized for both desktop and mobile views using a fluid CSS-first approach.

Developed with the MERN Stack for efficiency and scale.