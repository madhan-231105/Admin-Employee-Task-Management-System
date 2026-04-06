import { useState, useEffect } from "react";
import API from "../services/api";
import { COLORS, S } from "../theme";
import Avatar from "../components/Avatar";
import Modal from "../components/Modal";

export default function AdminPortal() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState("employees");
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", priority: "medium" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const empRes = await API.get("/admin/employees");
    const taskRes = await API.get("/admin/all-tasks"); // Add this route to backend
    setEmployees(empRes.data);
    setTasks(taskRes.data);
  };

  const handleApprove = async (id) => {
    await API.patch(`/admin/approve/${id}`);
    fetchData();
  };

  const handleAssign = async () => {
    await API.post("/admin/tasks", { ...taskForm, assignedTo: showAssignModal._id });
    setShowAssignModal(null);
    fetchData();
  };

  return (
    <div style={S.app}>
      {/* Topbar and Stats Row exactly as per your prototype */}
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button onClick={() => setTab("employees")} style={S.btn(tab === "employees" ? "primary" : "ghost")}>Employees</button>
          <button onClick={() => setTab("tasks")} style={S.btn(tab === "tasks" ? "primary" : "ghost")}>Tasks</button>
        </div>

        {tab === "employees" && employees.map(emp => (
          <div key={emp._id} style={{ ...S.card, display: 'flex', alignItems: 'center', marginBottom: 10 }}>
            <Avatar name={emp.name} />
            <div style={{ flex: 1, marginLeft: 15 }}>{emp.name} <span style={S.badge(emp.isApproved ? 'approved' : 'pending')}>{emp.isApproved ? 'Approved' : 'Pending'}</span></div>
            {!emp.isApproved && <button onClick={() => handleApprove(emp._id)} style={S.btn("success")}>Approve</button>}
            {emp.isApproved && <button onClick={() => setShowAssignModal(emp)} style={S.btn("primary")}>Assign Task</button>}
          </div>
        ))}
      </div>

      {showAssignModal && (
        <Modal title={`Assign to ${showAssignModal.name}`} onClose={() => setShowAssignModal(null)}>
          <input placeholder="Task Title" style={S.input} onChange={e => setTaskForm({...taskForm, title: e.target.value})} />
          <textarea placeholder="Description" style={{ ...S.input, marginTop: 10 }} onChange={e => setTaskForm({...taskForm, description: e.target.value})} />
          <button onClick={handleAssign} style={{ ...S.btn("primary"), marginTop: 10, width: '100%' }}>Assign</button>
        </Modal>
      )}
    </div>
  );
}