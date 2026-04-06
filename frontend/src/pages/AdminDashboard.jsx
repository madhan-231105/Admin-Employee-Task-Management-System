import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:        "#0b0f1a",
  surface:   "#111827",
  card:      "#161d2e",
  border:    "#1e2d45",
  accent:    "#6366f1",       // indigo
  accentGlow:"rgba(99,102,241,0.3)",
  gold:      "#f59e0b",
  emerald:   "#10b981",
  rose:      "#f43f5e",
  sky:       "#38bdf8",
  text:      "#f1f5f9",
  muted:     "#64748b",
  sub:       "#94a3b8",
};

const STAT_PALETTE = [
  { bg: "linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)", accent: "#818cf8", icon: "👥" },
  { bg: "linear-gradient(135deg,#064e3b 0%,#065f46 100%)", accent: "#34d399", icon: "✅" },
  { bg: "linear-gradient(135deg,#7c2d12 0%,#9a3412 100%)", accent: "#fb923c", icon: "⏳" },
  { bg: "linear-gradient(135deg,#0c4a6e 0%,#075985 100%)", accent: "#38bdf8", icon: "📋" },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const glassCard = {
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  backdropFilter: "blur(12px)",
};

const S = {
  app: {
    minHeight: "100vh",
    background: C.bg,
    fontFamily: "'Sora', 'DM Sans', sans-serif",
    color: C.text,
    backgroundImage: `
      radial-gradient(ellipse 80% 60% at 10% 0%, rgba(99,102,241,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 90% 100%, rgba(16,185,129,0.06) 0%, transparent 60%)
    `,
  },
  input: {
    width: "100%",
    background: "#0d1424",
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "11px 15px",
    color: C.text,
    fontSize: 14,
    outline: "none",
    transition: "border-color .2s",
    boxSizing: "border-box",
  },
  btn: (v = "primary") => ({
    padding: "9px 20px",
    borderRadius: 10,
    border: "none",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: ".3px",
    transition: "all .2s",
    background:
      v === "primary" ? `linear-gradient(135deg, #6366f1, #8b5cf6)` :
      v === "success" ? `linear-gradient(135deg, #10b981, #059669)` :
      v === "danger"  ? `linear-gradient(135deg, #f43f5e, #e11d48)` :
      v === "ghost"   ? "transparent" : C.surface,
    color: v === "ghost" ? C.sub : "#fff",
    border: v === "ghost" ? `1px solid ${C.border}` : "none",
    boxShadow: v === "primary" ? "0 4px 20px rgba(99,102,241,0.35)" :
               v === "success" ? "0 4px 20px rgba(16,185,129,0.35)" : "none",
  }),
  badge: (s) => {
    const map = {
      pending:   { bg: "rgba(251,146,60,0.15)", color: "#fb923c" },
      approved:  { bg: "rgba(52,211,153,0.15)", color: "#34d399" },
      active:    { bg: "rgba(52,211,153,0.15)", color: "#34d399" },
      completed: { bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
      high:      { bg: "rgba(244,63,94,0.15)",  color: "#f87171" },
      medium:    { bg: "rgba(251,146,60,0.15)", color: "#fb923c" },
      low:       { bg: "rgba(52,211,153,0.15)", color: "#34d399" },
    };
    const t = map[s?.toLowerCase()] || { bg: "#222", color: C.sub };
    return {
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: ".5px",
      background: t.bg, color: t.color,
    };
  },
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function StatCard({ label, value, idx }) {
  const p = STAT_PALETTE[idx % STAT_PALETTE.length];
  return (
    <div style={{
      ...glassCard,
      background: p.bg,
      padding: "1.4rem",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -10, right: -10,
        width: 70, height: 70, borderRadius: "50%",
        background: "rgba(255,255,255,0.04)",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
          <h1 style={{ margin: "6px 0 0", fontSize: 36, fontWeight: 800, color: "#fff" }}>{value}</h1>
        </div>
        <span style={{ fontSize: 28 }}>{p.icon}</span>
      </div>
      <div style={{ marginTop: 10, height: 3, borderRadius: 99, background: "rgba(255,255,255,0.1)" }}>
        <div style={{ height: "100%", width: `${Math.min((value / 20) * 100, 100)}%`, background: p.accent, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function Avatar({ name, size = 40 }) {
  const initials = name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
  const colors = ["#6366f1","#8b5cf6","#ec4899","#10b981","#f59e0b","#38bdf8"];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${color}22`, border: `2px solid ${color}55`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 800, color, flexShrink: 0,
    }}>{initials}</div>
  );
}

function TaskCard({ task, showEmployee }) {
  const priorityColors = { high: C.rose, medium: C.gold, low: C.emerald };
  const pc = priorityColors[task.priority?.toLowerCase()] || C.muted;
  return (
    <div style={{
      ...glassCard,
      display: "flex", alignItems: "flex-start", gap: 14,
      padding: "1rem 1.25rem", marginBottom: 10,
      borderLeft: `3px solid ${pc}`,
      transition: "transform .15s, box-shadow .15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = `0 4px 24px ${pc}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: pc, marginTop: 6, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{task.title}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={S.badge(task.priority)}>{task.priority}</span>
            <span style={S.badge(task.status)}>{task.status}</span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{task.description || "No description provided."}</p>
        {showEmployee && task.assignedTo && (
          <p style={{ margin: "6px 0 0", fontSize: 12, color: C.accent }}>
            👤 {task.assignedTo?.name || "Unknown"}
          </p>
        )}
      </div>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(6px)",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        ...glassCard,
        width: "90%", maxWidth: 460,
        boxShadow: `0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px ${C.border}`,
        animation: "slideUp .2s ease",
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity:0 } to { transform: none; opacity:1 } }`}</style>
        <div style={{
          padding: "1.4rem 1.5rem",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{title}</h3>
            {subtitle && <p style={{ margin: "3px 0 0", fontSize: 12, color: C.muted }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`,
            color: C.sub, width: 30, height: 30, borderRadius: 8,
            cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>
        <div style={{ padding: "1.5rem" }}>{children}</div>
      </div>
    </div>
  );
}

function Toast({ msg, type }) {
  const colors = { success: C.emerald, danger: C.rose, warning: C.gold };
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: C.surface, border: `1px solid ${colors[type] || C.border}`,
      color: C.text, padding: "12px 20px", borderRadius: 12,
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 0 1px ${colors[type]}44`,
      animation: "slideUp .2s ease",
      fontWeight: 600, fontSize: 14,
    }}>
      <span style={{ color: colors[type] }}>
        {type === "success" ? "✓" : type === "danger" ? "✕" : "!"}
      </span>
      {msg}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AdminPortal() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState("employees");
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", priority: "medium" });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Auth Guard: prevent back-navigation to login ──────────────────────────
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token || user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    // Push a dummy history entry so pressing Back doesn't go to /login
    window.history.pushState(null, "", window.location.href);
    const blockBack = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const empRes = await API.get("/admin/employees");
      setEmployees(empRes.data);

      try {
        const taskRes = await API.get("/admin/tasks/all");
        setTasks(taskRes.data);
      } catch {
        setTasks([]);
      }
    } catch (err) {
      showToast("Could not connect to server", "danger");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = async (id) => {
    try {
      await API.patch(`/admin/approve/${id}`);
      setEmployees(prev => prev.map(e => e._id === id ? { ...e, isApproved: true } : e));
      showToast("Employee approved successfully!", "success");
    } catch {
      showToast("Approval failed. Try again.", "danger");
    }
  };

  const handleAssignTask = async () => {
    if (!taskForm.title.trim()) return showToast("Task title is required", "danger");
    try {
      await API.post("/admin/tasks", { ...taskForm, assignedTo: showAssignModal._id });
      setShowAssignModal(null);
      setTaskForm({ title: "", description: "", priority: "medium" });
      showToast("Task assigned successfully!");
      fetchData();
    } catch {
      showToast("Failed to assign task", "danger");
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const filteredEmployees = employees.filter(e =>
    e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter(t =>
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Employees", value: employees.length },
    { label: "Approved",        value: employees.filter(e => e.isApproved).length },
    { label: "Pending",         value: employees.filter(e => !e.isApproved).length },
    { label: "Tasks",           value: tasks.length },
  ];

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0b0f1a; }
        ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 99px; }
        input:focus, select:focus, textarea:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        button:hover { opacity: .88; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background: "rgba(17,24,39,0.85)", backdropFilter: "blur(16px)",
        padding: "0 2rem", height: 60,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: `1px solid ${C.border}`,
        position: "sticky", top: 0, zIndex: 500,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, boxShadow: "0 4px 14px rgba(99,102,241,0.5)",
          }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-.3px" }}>
            TaskFlow <span style={{ fontSize: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700, letterSpacing: 1 }}>ADMIN</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={user?.name} size={32} />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: C.muted }}>Administrator</div>
          </div>
          <button onClick={handleSignOut} style={{ ...S.btn("ghost"), marginLeft: 8 }}>Sign out</button>
        </div>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ── Stats Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginBottom: "2rem" }}>
          {stats.map((s, i) => <StatCard key={s.label} label={s.label} value={s.value} idx={i} />)}
        </div>

        {/* ── Toolbar ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: 12 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, background: C.surface, padding: 4, borderRadius: 12, border: `1px solid ${C.border}` }}>
            {["employees", "tasks"].map(t => (
              <button key={t} onClick={() => { setTab(t); setSearchQuery(""); }} style={{
                background: tab === t ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                border: "none", color: tab === t ? "#fff" : C.muted,
                padding: "8px 20px", borderRadius: 9, cursor: "pointer",
                fontSize: 13, fontWeight: 700, textTransform: "capitalize",
                transition: "all .2s",
                boxShadow: tab === t ? "0 4px 14px rgba(99,102,241,0.4)" : "none",
              }}>{t}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted, fontSize: 14 }}>🔍</span>
            <input
              placeholder={`Search ${tab}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ ...S.input, width: 220, paddingLeft: 36 }}
            />
          </div>
        </div>

        {/* ── Content ── */}
        <div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: C.muted }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
              <p>Loading data...</p>
            </div>
          ) : tab === "employees" ? (
            filteredEmployees.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: C.muted }}>
                <div style={{ fontSize: 40 }}>👥</div>
                <p style={{ marginTop: 12 }}>{searchQuery ? "No matching employees" : "No employees found."}</p>
              </div>
            ) : (
              filteredEmployees.map((emp, i) => (
                <div key={emp._id} style={{
                  ...glassCard,
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "1rem 1.4rem", marginBottom: 10,
                  transition: "border-color .2s, box-shadow .2s",
                  animation: `slideUp .2s ease ${i * 0.04}s both`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = ""; }}
                >
                  <Avatar name={emp.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{emp.name}</span>
                      <span style={S.badge(emp.isApproved ? "active" : "pending")}>
                        {emp.isApproved ? "Active" : "Pending"}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {emp.email} {emp.department && `· ${emp.department}`}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    {!emp.isApproved ? (
                      <button onClick={() => handleApprove(emp._id)} style={S.btn("success")}>✓ Approve</button>
                    ) : (
                      <button onClick={() => setShowAssignModal(emp)} style={S.btn("primary")}>+ Assign Task</button>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            filteredTasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: C.muted }}>
                <div style={{ fontSize: 40 }}>📋</div>
                <p style={{ marginTop: 12 }}>{searchQuery ? "No matching tasks" : "No tasks found."}</p>
              </div>
            ) : filteredTasks.map(task => <TaskCard key={task._id} task={task} showEmployee />)
          )}
        </div>
      </div>

      {/* ── Assign Task Modal ── */}
      {showAssignModal && (
        <Modal
          title="Assign New Task"
          subtitle={`Assigning to ${showAssignModal.name} · ${showAssignModal.department || "No dept"}`}
          onClose={() => { setShowAssignModal(null); setTaskForm({ title: "", description: "", priority: "medium" }); }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>Task Title *</label>
              <input
                placeholder="e.g. Complete Q4 Report"
                style={S.input}
                value={taskForm.title}
                onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>Description</label>
              <textarea
                placeholder="Optional details about the task..."
                style={{ ...S.input, minHeight: 80, resize: "vertical", fontFamily: "inherit" }}
                value={taskForm.description}
                onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>Priority</label>
              <select
                style={S.input}
                value={taskForm.priority}
                onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onClick={() => { setShowAssignModal(null); setTaskForm({ title: "", description: "", priority: "medium" }); }}
                style={{ ...S.btn("ghost"), flex: 1 }}
              >Cancel</button>
              <button onClick={handleAssignTask} style={{ ...S.btn("primary"), flex: 2 }}>⚡ Assign Task</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}