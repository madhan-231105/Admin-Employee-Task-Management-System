import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ─── EXACT COLOR PALETTE ──────────────────────────────────────────────────────
const C = {
  slate:       "#262626",
  secondhand:  "#3f3f3f",
  whitish:     "#f5f5f5",
  lightGrey:   "#dcdcdc",
  // Functional accents derived from the palette
  accent:      "#f5f5f5",
  accentSoft:  "rgba(245,245,245,0.08)",
  border:      "#4a4a4a",
  muted:       "#9a9a9a",
  sub:         "#7a7a7a",
  // Status colors — soft enough to complement the neutral palette
  success:     "#6fcf97",
  warning:     "#f2994a",
  danger:      "#eb5757",
  info:        "#a8c4dc",
};

const STAT_CONFIGS = [
  { icon: "👥", label: "Total Employees", accent: C.lightGrey },
  { icon: "✅", label: "Approved",        accent: C.success   },
  { icon: "⏳", label: "Pending",         accent: C.warning   },
  { icon: "📋", label: "Tasks",           accent: C.info      },
];

// ─── BASE STYLES ──────────────────────────────────────────────────────────────
const card = {
  background: C.secondhand,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
};

const S = {
  input: {
    width: "100%",
    background: C.slate,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "11px 15px",
    color: C.whitish,
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color .2s, box-shadow .2s",
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
    transition: "opacity .18s, transform .18s",
    fontFamily: "inherit",
    ...(v === "primary" && {
      background: C.whitish,
      color: C.slate,
      boxShadow: "0 2px 10px rgba(245,245,245,0.12)",
    }),
    ...(v === "success" && {
      background: C.success,
      color: C.slate,
      boxShadow: "0 2px 10px rgba(111,207,151,0.2)",
    }),
    ...(v === "danger" && {
      background: C.danger,
      color: C.whitish,
    }),
    ...(v === "ghost" && {
      background: "transparent",
      color: C.lightGrey,
      border: `1px solid ${C.border}`,
    }),
    ...(v === "subtle" && {
      background: "rgba(245,245,245,0.06)",
      color: C.lightGrey,
      border: `1px solid ${C.border}`,
    }),
  }),
  badge: (s) => {
    const map = {
      pending:   { bg: "rgba(242,153,74,0.14)",  color: C.warning },
      approved:  { bg: "rgba(111,207,151,0.12)", color: C.success },
      active:    { bg: "rgba(111,207,151,0.12)", color: C.success },
      completed: { bg: "rgba(168,196,220,0.12)", color: C.info    },
      high:      { bg: "rgba(235,87,87,0.13)",   color: C.danger  },
      medium:    { bg: "rgba(242,153,74,0.13)",  color: C.warning },
      low:       { bg: "rgba(111,207,151,0.12)", color: C.success },
    };
    const t = map[s?.toLowerCase()] || { bg: "rgba(220,220,220,0.07)", color: C.muted };
    return {
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 99,
      fontSize: 10, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: ".6px",
      background: t.bg, color: t.color,
    };
  },
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function StatCard({ label, value, idx }) {
  const cfg = STAT_CONFIGS[idx];
  return (
    <div style={{
      ...card,
      padding: "1.4rem 1.5rem",
      borderTop: `3px solid ${cfg.accent}`,
      position: "relative", overflow: "hidden",
      transition: "transform .18s, box-shadow .18s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Watermark icon */}
      <span style={{
        position: "absolute", right: 16, top: 12,
        fontSize: 40, opacity: 0.08, userSelect: "none",
      }}>{cfg.icon}</span>

      <p style={{
        margin: 0, fontSize: 10, color: C.muted,
        textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700,
      }}>{label}</p>

      <h1 style={{
        margin: "8px 0 14px", fontSize: 40,
        fontWeight: 800, color: C.whitish, lineHeight: 1,
      }}>{value}</h1>

      <div style={{ height: 2, background: `${C.border}`, borderRadius: 99 }}>
        <div style={{
          height: "100%",
          width: `${Math.min(Math.max((value / 15) * 100, 8), 100)}%`,
          background: cfg.accent,
          borderRadius: 99,
          transition: "width 1.2s cubic-bezier(.16,1,.3,1)",
          opacity: 0.75,
        }} />
      </div>
    </div>
  );
}

function Avatar({ name, size = 40 }) {
  const initials = name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "#4a4a4a",
      border: `2px solid #5c5c5c`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 800,
      color: C.lightGrey, flexShrink: 0,
    }}>{initials}</div>
  );
}

function TaskCard({ task, showEmployee }) {
  const pc = { high: C.danger, medium: C.warning, low: C.success }[task.priority?.toLowerCase()] || C.sub;
  return (
    <div style={{
      ...card,
      display: "flex", alignItems: "flex-start", gap: 14,
      padding: "1rem 1.25rem", marginBottom: 10,
      borderLeft: `3px solid ${pc}`,
      transition: "background .18s, box-shadow .18s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "#474747";
        e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = C.secondhand;
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: pc, marginTop: 5, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 5 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.whitish }}>{task.title}</span>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <span style={S.badge(task.priority)}>{task.priority}</span>
            <span style={S.badge(task.status)}>{task.status}</span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{task.description || "No description provided."}</p>
        {showEmployee && task.assignedTo && (
          <p style={{ margin: "6px 0 0", fontSize: 12, color: C.lightGrey }}>
            ↳ {task.assignedTo?.name || "Unknown"}
          </p>
        )}
      </div>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(15,15,15,0.8)",
        backdropFilter: "blur(5px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div style={{
        ...card,
        width: "90%", maxWidth: 460,
        boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
        animation: "modalIn .22s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{
          padding: "1.2rem 1.5rem",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.whitish }}>{title}</h3>
            {subtitle && <p style={{ margin: "3px 0 0", fontSize: 12, color: C.muted }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{
            background: "rgba(245,245,245,0.05)",
            border: `1px solid ${C.border}`,
            color: C.sub, width: 30, height: 30,
            borderRadius: 8, cursor: "pointer",
            fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit",
          }}>×</button>
        </div>
        <div style={{ padding: "1.5rem" }}>{children}</div>
      </div>
    </div>
  );
}

function Toast({ msg, type }) {
  const col = { success: C.success, danger: C.danger, warning: C.warning }[type] || C.lightGrey;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: C.secondhand,
      border: `1px solid ${col}55`,
      color: C.whitish,
      padding: "12px 20px", borderRadius: 12,
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
      animation: "modalIn .2s ease",
      fontWeight: 600, fontSize: 14,
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: "50%",
        background: `${col}20`, color: col,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 800,
      }}>
        {type === "success" ? "✓" : type === "danger" ? "✕" : "!"}
      </span>
      {msg}
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign: "center", padding: "5rem 2rem", color: C.muted }}>
      <div style={{ fontSize: 44, marginBottom: 14, opacity: .4 }}>{icon}</div>
      <p style={{ margin: 0, fontSize: 14 }}>{text}</p>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AdminPortal() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks]         = useState([]);
  const [tab, setTab]             = useState("employees");
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [taskForm, setTaskForm]   = useState({ title: "", description: "", priority: "medium" });
  const [toast, setToast]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");

  // ── Auth Guard + Back-button block ────────────────────────────────────────
  useEffect(() => {
    const user  = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    if (!user || !token || user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }
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
      } catch { setTasks([]); }
    } catch {
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
      showToast("Employee approved!", "success");
    } catch { showToast("Approval failed", "danger"); }
  };

  const handleAssignTask = async () => {
    if (!taskForm.title.trim()) return showToast("Task title is required", "danger");
    try {
      await API.post("/admin/tasks", { ...taskForm, assignedTo: showAssignModal._id });
      setShowAssignModal(null);
      setTaskForm({ title: "", description: "", priority: "medium" });
      showToast("Task assigned successfully!");
      fetchData();
    } catch { showToast("Failed to assign task", "danger"); }
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const filteredEmployees = employees.filter(e =>
    [e.name, e.email, e.department].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );
  const filteredTasks = tasks.filter(t =>
    [t.title, t.assignedTo?.name].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = [
    employees.length,
    employees.filter(e => e.isApproved).length,
    employees.filter(e => !e.isApproved).length,
    tasks.length,
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: C.slate,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: C.whitish,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.slate}; }
        ::-webkit-scrollbar-thumb { background: ${C.secondhand}; border-radius: 99px; }
        input:focus, select:focus, textarea:focus {
          border-color: ${C.lightGrey} !important;
          box-shadow: 0 0 0 3px rgba(220,220,220,0.09) !important;
        }
        button:active { transform: scale(.97); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes modalIn {
          from { transform: scale(.96) translateY(10px); opacity: 0; }
          to   { transform: none; opacity: 1; }
        }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{
        background: C.secondhand,
        borderBottom: `1px solid ${C.border}`,
        padding: "0 2rem", height: 58,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 500,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: C.slate,
            border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14,
          }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: C.whitish, letterSpacing: "-.3px" }}>
            TaskFlow
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
            color: C.muted, textTransform: "uppercase",
            background: "rgba(245,245,245,0.05)",
            padding: "2px 8px", borderRadius: 4,
            border: `1px solid ${C.border}`,
          }}>ADMIN</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.whitish }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: C.muted }}>Administrator</div>
          </div>
          <Avatar name={user?.name} size={34} />
          <div style={{ width: 1, height: 24, background: C.border }} />
          <button onClick={handleSignOut} style={S.btn("ghost")}>Sign out</button>
        </div>
      </header>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ── Stat Cards ───────────────────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14, marginBottom: "2rem",
        }}>
          {stats.map((val, i) => (
            <div key={i} style={{ animation: `fadeUp .28s ease ${i * 0.06}s both` }}>
              <StatCard label={STAT_CONFIGS[i].label} value={val} idx={i} />
            </div>
          ))}
        </div>

        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: "1.25rem", gap: 12, flexWrap: "wrap",
        }}>
          {/* Tab switcher */}
          <div style={{
            display: "flex", gap: 2,
            background: C.secondhand,
            padding: 4, borderRadius: 11,
            border: `1px solid ${C.border}`,
          }}>
            {["employees", "tasks"].map(t => (
              <button key={t} onClick={() => { setTab(t); setSearch(""); }} style={{
                background: tab === t ? C.slate : "transparent",
                border: tab === t ? `1px solid #555` : "1px solid transparent",
                color: tab === t ? C.whitish : C.muted,
                padding: "7px 22px", borderRadius: 8,
                cursor: "pointer", fontSize: 13, fontWeight: 700,
                textTransform: "capitalize", transition: "all .18s",
                boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
                fontFamily: "inherit",
              }}>{t}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: C.sub,
              fontSize: 14, pointerEvents: "none",
            }}>⌕</span>
            <input
              placeholder={`Search ${tab}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...S.input, width: 220, paddingLeft: 34 }}
            />
          </div>
        </div>

        {/* ── Section row ──────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
        }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: C.lightGrey, textTransform: "capitalize", whiteSpace: "nowrap" }}>
            {tab}
            <span style={{ marginLeft: 7, fontSize: 11, color: C.sub, fontWeight: 500 }}>
              ({tab === "employees" ? filteredEmployees.length : filteredTasks.length})
            </span>
          </h2>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <button onClick={fetchData} style={{ ...S.btn("subtle"), padding: "6px 14px", fontSize: 12 }}>
            ↺ Refresh
          </button>
        </div>

        {/* ── List content ─────────────────────────────────────────────────── */}
        {loading ? (
          <EmptyState icon="⏳" text="Loading…" />
        ) : tab === "employees" ? (
          filteredEmployees.length === 0
            ? <EmptyState icon="👥" text={search ? "No matching employees" : "No employees yet."} />
            : filteredEmployees.map((emp, i) => (
              <div key={emp._id} style={{
                ...card,
                display: "flex", alignItems: "center", gap: 14,
                padding: "1rem 1.4rem", marginBottom: 10,
                transition: "background .18s, border-color .18s, box-shadow .18s",
                animation: `fadeUp .22s ease ${i * 0.04}s both`,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#474747";
                  e.currentTarget.style.borderColor = "#5a5a5a";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = C.secondhand;
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <Avatar name={emp.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: C.whitish }}>{emp.name}</span>
                    <span style={S.badge(emp.isApproved ? "active" : "pending")}>
                      {emp.isApproved ? "Active" : "Pending"}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {emp.email}{emp.department ? ` · ${emp.department}` : ""}
                  </p>
                </div>
                {!emp.isApproved
                  ? <button onClick={() => handleApprove(emp._id)} style={S.btn("success")}>✓ Approve</button>
                  : <button onClick={() => setShowAssignModal(emp)} style={S.btn("primary")}>+ Assign Task</button>
                }
              </div>
            ))
        ) : (
          filteredTasks.length === 0
            ? <EmptyState icon="📋" text={search ? "No matching tasks" : "No tasks yet."} />
            : filteredTasks.map(task => <TaskCard key={task._id} task={task} showEmployee />)
        )}
      </main>

      {/* ── Assign Modal ───────────────────────────────────────────────────── */}
      {showAssignModal && (
        <Modal
          title="Assign New Task"
          subtitle={`→ ${showAssignModal.name}${showAssignModal.department ? ` · ${showAssignModal.department}` : ""}`}
          onClose={() => { setShowAssignModal(null); setTaskForm({ title: "", description: "", priority: "medium" }); }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, display: "block", marginBottom: 6 }}>
                Task Title *
              </label>
              <input
                placeholder="e.g. Complete Q4 Report"
                style={S.input}
                value={taskForm.title}
                onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, display: "block", marginBottom: 6 }}>
                Description
              </label>
              <textarea
                placeholder="Optional details…"
                style={{ ...S.input, minHeight: 82, resize: "vertical" }}
                value={taskForm.description}
                onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, display: "block", marginBottom: 6 }}>
                Priority
              </label>
              <select
                style={S.input}
                value={taskForm.priority}
                onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div style={{ height: 1, background: C.border, margin: "2px 0" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setShowAssignModal(null); setTaskForm({ title: "", description: "", priority: "medium" }); }}
                style={{ ...S.btn("ghost"), flex: 1 }}
              >Cancel</button>
              <button onClick={handleAssignTask} style={{ ...S.btn("primary"), flex: 2 }}>
                Assign Task
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}