import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const C = {
  slate:      "#262626",
  secondhand: "#3f3f3f",
  whitish:    "#f5f5f5",
  lightGrey:  "#dcdcdc",
  border:     "#4a4a4a",
  muted:      "#9a9a9a",
  sub:        "#7a7a7a",
  success:    "#6fcf97",
  warning:    "#f2994a",
  danger:     "#eb5757",
  info:       "#a8c4dc",
};

// ─── STAT CONFIG ──────────────────────────────────────────────────────────────
const EMP_STATS = [
  { key: "total",    label: "Total Employees", icon: "👥", accent: C.lightGrey },
  { key: "approved", label: "Approved",        icon: "✅", accent: C.success   },
  { key: "pending",  label: "Pending",         icon: "⏳", accent: C.warning   },
];
const TASK_STATS = [
  { key: "total",      label: "Total Tasks",  icon: "📋", accent: C.lightGrey },
  { key: "Pending",    label: "Pending",      icon: "⏳", accent: C.warning   },
  { key: "In Progress",label: "In Progress",  icon: "🔄", accent: C.info      },
  { key: "Completed",  label: "Completed",    icon: "✅", accent: C.success   },
];

// ─── BASE CARD / STYLES ───────────────────────────────────────────────────────
const card = { background: C.secondhand, border: `1px solid ${C.border}`, borderRadius: 14 };

const S = {
  input: {
    background: C.slate, border: `1px solid ${C.border}`, borderRadius: 10,
    padding: "10px 14px", color: C.whitish, fontSize: 13, outline: "none",
    fontFamily: "inherit", transition: "border-color .2s, box-shadow .2s",
    boxSizing: "border-box",
  },
  btn: (v = "primary") => ({
    padding: "9px 18px", borderRadius: 10, border: "none",
    fontSize: 13, fontWeight: 700, cursor: "pointer",
    letterSpacing: ".3px", transition: "opacity .18s, transform .18s",
    fontFamily: "inherit",
    ...(v === "primary" && { background: C.whitish,  color: C.slate,   boxShadow: "0 2px 10px rgba(245,245,245,0.12)" }),
    ...(v === "success" && { background: C.success,  color: C.slate,   boxShadow: "0 2px 10px rgba(111,207,151,0.2)"  }),
    ...(v === "danger"  && { background: C.danger,   color: C.whitish  }),
    ...(v === "ghost"   && { background: "transparent", color: C.lightGrey, border: `1px solid ${C.border}` }),
    ...(v === "subtle"  && { background: "rgba(245,245,245,0.06)", color: C.lightGrey, border: `1px solid ${C.border}` }),
  }),
  badge: (s) => {
    const map = {
      pending:      { bg: "rgba(242,153,74,0.14)",  color: C.warning },
      "in progress":{ bg: "rgba(168,196,220,0.13)", color: C.info    },
      approved:     { bg: "rgba(111,207,151,0.12)", color: C.success },
      active:       { bg: "rgba(111,207,151,0.12)", color: C.success },
      completed:    { bg: "rgba(111,207,151,0.12)", color: C.success },
      high:         { bg: "rgba(235,87,87,0.13)",   color: C.danger  },
      medium:       { bg: "rgba(242,153,74,0.13)",  color: C.warning },
      low:          { bg: "rgba(111,207,151,0.12)", color: C.success },
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

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, onClick, active }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...card,
        padding: "1.3rem 1.4rem",
        borderTop: `3px solid ${accent}`,
        position: "relative", overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "transform .18s, box-shadow .18s",
        outline: active ? `2px solid ${accent}` : "none",
        outlineOffset: 2,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.32)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <span style={{ position: "absolute", right: 14, top: 10, fontSize: 36, opacity: 0.08, userSelect: "none" }}>{icon}</span>
      <p style={{ margin: 0, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700 }}>{label}</p>
      <h2 style={{ margin: "7px 0 12px", fontSize: 36, fontWeight: 800, color: C.whitish, lineHeight: 1 }}>{value}</h2>
      <div style={{ height: 2, background: C.border, borderRadius: 99 }}>
        <div style={{ height: "100%", width: `${Math.min(Math.max((value / 15) * 100, 8), 100)}%`, background: accent, borderRadius: 99, opacity: 0.75, transition: "width 1.2s cubic-bezier(.16,1,.3,1)" }} />
      </div>
    </div>
  );
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 40 }) {
  const initials = name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "#4a4a4a", border: `2px solid #5c5c5c`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 800, color: C.lightGrey, flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─── TASK CARD (admin view) ───────────────────────────────────────────────────
function TaskCard({ task }) {
  const pc = { high: C.danger, medium: C.warning, low: C.success }[task.priority?.toLowerCase()] || C.sub;
  return (
    <div style={{
      ...card,
      display: "flex", alignItems: "flex-start", gap: 14,
      padding: "1rem 1.25rem", marginBottom: 10,
      borderLeft: `3px solid ${pc}`,
      transition: "background .18s, box-shadow .18s",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "#474747"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.3)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = C.secondhand; e.currentTarget.style.boxShadow = ""; }}
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
        {task.assignedTo && (
          <p style={{ margin: "6px 0 0", fontSize: 12, color: C.lightGrey }}>↳ {task.assignedTo?.name || "Unknown"}</p>
        )}
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, subtitle, onClose, children }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(15,15,15,0.82)",
      backdropFilter: "blur(5px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 1000,
    }}>
      <div style={{ ...card, width: "90%", maxWidth: 460, boxShadow: "0 30px 70px rgba(0,0,0,0.55)", animation: "modalIn .22s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ padding: "1.2rem 1.5rem", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.whitish }}>{title}</h3>
            {subtitle && <p style={{ margin: "3px 0 0", fontSize: 12, color: C.muted }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: "rgba(245,245,245,0.05)", border: `1px solid ${C.border}`, color: C.sub, width: 30, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>×</button>
        </div>
        <div style={{ padding: "1.5rem" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  const col = { success: C.success, danger: C.danger, warning: C.warning }[type] || C.lightGrey;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: C.secondhand, border: `1px solid ${col}55`, color: C.whitish,
      padding: "12px 20px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 30px rgba(0,0,0,0.5)", animation: "modalIn .2s ease",
      fontWeight: 600, fontSize: 14,
    }}>
      <span style={{ width: 22, height: 22, borderRadius: "50%", background: `${col}20`, color: col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>
        {type === "success" ? "✓" : type === "danger" ? "✕" : "!"}
      </span>
      {msg}
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign: "center", padding: "5rem 2rem", color: C.muted }}>
      <div style={{ fontSize: 44, marginBottom: 14, opacity: .4 }}>{icon}</div>
      <p style={{ margin: 0, fontSize: 14 }}>{text}</p>
    </div>
  );
}

// ─── FILTER PILL BAR ──────────────────────────────────────────────────────────
function FilterBar({ options, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2, background: C.secondhand, padding: 4, borderRadius: 11, border: `1px solid ${C.border}` }}>
      {options.map(opt => (
        <button key={opt.key} onClick={() => onChange(opt.key)} style={{
          background: active === opt.key ? C.slate : "transparent",
          border: active === opt.key ? `1px solid #555` : "1px solid transparent",
          color: active === opt.key ? C.whitish : C.muted,
          padding: "6px 14px", borderRadius: 8, cursor: "pointer",
          fontSize: 12, fontWeight: 700, transition: "all .18s", fontFamily: "inherit",
          boxShadow: active === opt.key ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
          whiteSpace: "nowrap",
        }}>{opt.icon} {opt.label}</button>
      ))}
    </div>
  );
}

// ─── SECTION ROW ─────────────────────────────────────────────────────────────
function SectionRow({ label, count, onRefresh }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: C.lightGrey, whiteSpace: "nowrap" }}>
        {label}
        <span style={{ marginLeft: 7, fontSize: 11, color: C.sub, fontWeight: 500 }}>({count})</span>
      </h2>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <button onClick={onRefresh} style={{ ...S.btn("subtle"), padding: "6px 14px", fontSize: 12 }}>↺ Refresh</button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AdminPortal() {
  const navigate = useNavigate();

  const [employees, setEmployees]   = useState([]);
  const [tasks, setTasks]           = useState([]);
  const [tab, setTab]               = useState("employees");
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [taskForm, setTaskForm]     = useState({ title: "", description: "", priority: "medium" });
  const [toast, setToast]           = useState(null);
  const [loading, setLoading]       = useState(true);

  // ── Per-tab toolbar state ─────────────────────────────────────────────────
  const [empSearch,  setEmpSearch]  = useState("");
  const [empFilter,  setEmpFilter]  = useState("all");   // all | active | pending
  const [empSort,    setEmpSort]    = useState("name");  // name | dept

  const [taskSearch, setTaskSearch] = useState("");
  const [taskFilter, setTaskFilter] = useState("all");   // all | Pending | In Progress | Completed
  const [taskSort,   setTaskSort]   = useState("newest");// newest | oldest | priority | title

  // ── Auth Guard + back-button block ────────────────────────────────────────
  useEffect(() => {
    const user  = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    if (!user || !token || user.role !== "admin") { navigate("/", { replace: true }); return; }
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
    } catch { showToast("Could not connect to server", "danger"); }
    finally { setLoading(false); }
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

  const handleSignOut = () => { localStorage.clear(); navigate("/", { replace: true }); };

  // ── Derived: employees ────────────────────────────────────────────────────
  const filteredEmployees = employees
    .filter(e => {
      const q = empSearch.toLowerCase();
      const matchSearch = [e.name, e.email, e.department].some(v => v?.toLowerCase().includes(q));
      const matchFilter = empFilter === "all" ? true : empFilter === "active" ? e.isApproved : !e.isApproved;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => empSort === "name" ? a.name?.localeCompare(b.name) : (a.department || "").localeCompare(b.department || ""));

  // ── Derived: tasks ────────────────────────────────────────────────────────
  const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
  const filteredTasks = tasks
    .filter(t => {
      const q = taskSearch.toLowerCase();
      const matchSearch = [t.title, t.description, t.assignedTo?.name].some(v => v?.toLowerCase().includes(q));
      const matchFilter = taskFilter === "all" ? true : t.status === taskFilter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (taskSort === "newest")   return new Date(b.createdAt) - new Date(a.createdAt);
      if (taskSort === "oldest")   return new Date(a.createdAt) - new Date(b.createdAt);
      if (taskSort === "priority") return (PRIORITY_ORDER[a.priority?.toLowerCase()] ?? 9) - (PRIORITY_ORDER[b.priority?.toLowerCase()] ?? 9);
      if (taskSort === "title")    return a.title?.localeCompare(b.title);
      return 0;
    });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const empStats = {
    total:    employees.length,
    approved: employees.filter(e => e.isApproved).length,
    pending:  employees.filter(e => !e.isApproved).length,
  };
  const taskStats = {
    total:        tasks.length,
    "Pending":    tasks.filter(t => t.status === "Pending").length,
    "In Progress":tasks.filter(t => t.status === "In Progress").length,
    "Completed":  tasks.filter(t => t.status === "Completed").length,
  };

  // ── Filter options ────────────────────────────────────────────────────────
  const EMP_FILTER_OPTS = [
    { key: "all",     icon: "👥", label: "All"     },
    { key: "active",  icon: "✅", label: "Active"  },
    { key: "pending", icon: "⏳", label: "Pending" },
  ];
  const TASK_FILTER_OPTS = [
    { key: "all",         icon: "📋", label: "All"         },
    { key: "Pending",     icon: "⏳", label: "Pending"     },
    { key: "In Progress", icon: "🔄", label: "In Progress" },
    { key: "Completed",   icon: "✅", label: "Completed"   },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.slate, fontFamily: "'DM Sans','Segoe UI',sans-serif", color: C.whitish }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.slate}; }
        ::-webkit-scrollbar-thumb { background: ${C.secondhand}; border-radius: 99px; }
        input:focus, select:focus, textarea:focus { border-color: ${C.lightGrey} !important; box-shadow: 0 0 0 3px rgba(220,220,220,0.09) !important; }
        button:active { transform: scale(.97); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
        @keyframes modalIn { from { transform:scale(.96) translateY(10px); opacity:0 } to { transform:none; opacity:1 } }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{ background: C.secondhand, borderBottom: `1px solid ${C.border}`, padding: "0 2rem", height: 58, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 500 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.slate, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: C.whitish, letterSpacing: "-.3px" }}>TaskFlow</span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: C.muted, textTransform: "uppercase", background: "rgba(245,245,245,0.05)", padding: "2px 8px", borderRadius: 4, border: `1px solid ${C.border}` }}>ADMIN</span>
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

        {/* ── Main tab switcher ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 2, background: C.secondhand, padding: 4, borderRadius: 11, border: `1px solid ${C.border}`, width: "fit-content", marginBottom: "1.75rem" }}>
          {[{ key: "employees", icon: "👥" }, { key: "tasks", icon: "📋" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: tab === t.key ? C.slate : "transparent",
              border: tab === t.key ? `1px solid #555` : "1px solid transparent",
              color: tab === t.key ? C.whitish : C.muted,
              padding: "7px 24px", borderRadius: 8, cursor: "pointer",
              fontSize: 13, fontWeight: 700, textTransform: "capitalize",
              transition: "all .18s", fontFamily: "inherit",
              boxShadow: tab === t.key ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
            }}>{t.icon} {t.key}</button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            EMPLOYEES TAB
        ════════════════════════════════════════════════════════════════════ */}
        {tab === "employees" && (
          <>
            {/* Stat cards — clickable filters */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: "1.75rem" }}>
              {EMP_STATS.map((s, i) => (
                <div key={s.key} style={{ animation: `fadeUp .25s ease ${i * 0.06}s both` }}>
                  <StatCard
                    label={s.label} value={empStats[s.key]}
                    icon={s.icon} accent={s.accent}
                    active={empFilter === s.key}
                    onClick={() => setEmpFilter(empFilter === s.key ? "all" : s.key)}
                  />
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              {/* Search */}
              <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.sub, fontSize: 14, pointerEvents: "none" }}>⌕</span>
                <input placeholder="Search by name, email, department…" value={empSearch} onChange={e => setEmpSearch(e.target.value)} style={{ ...S.input, width: "100%", paddingLeft: 34 }} />
              </div>
              {/* Filter pills */}
              <FilterBar options={EMP_FILTER_OPTS} active={empFilter} onChange={setEmpFilter} />
              {/* Sort */}
              <select value={empSort} onChange={e => setEmpSort(e.target.value)} style={{ ...S.input, width: "auto", paddingRight: 28, cursor: "pointer" }}>
                <option value="name">Az Name</option>
                <option value="dept">Az Department</option>
              </select>
            </div>

            <SectionRow label="Employees" count={filteredEmployees.length} onRefresh={fetchData} />

            {loading ? <EmptyState icon="⏳" text="Loading…" /> :
              filteredEmployees.length === 0
                ? <EmptyState icon="👥" text={empSearch ? `No results for "${empSearch}"` : "No employees found."} />
                : filteredEmployees.map((emp, i) => (
                  <div key={emp._id} style={{
                    ...card, display: "flex", alignItems: "center", gap: 14,
                    padding: "1rem 1.4rem", marginBottom: 10,
                    transition: "background .18s, border-color .18s, box-shadow .18s",
                    animation: `fadeUp .22s ease ${i * 0.04}s both`,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#474747"; e.currentTarget.style.borderColor = "#5a5a5a"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.secondhand; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = ""; }}
                  >
                    <Avatar name={emp.name} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: C.whitish }}>{emp.name}</span>
                        <span style={S.badge(emp.isApproved ? "active" : "pending")}>{emp.isApproved ? "Active" : "Pending"}</span>
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
            }
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TASKS TAB
        ════════════════════════════════════════════════════════════════════ */}
        {tab === "tasks" && (
          <>
            {/* Stat cards — clickable filters */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14, marginBottom: "1.75rem" }}>
              {TASK_STATS.map((s, i) => (
                <div key={s.key} style={{ animation: `fadeUp .25s ease ${i * 0.06}s both` }}>
                  <StatCard
                    label={s.label} value={taskStats[s.key]}
                    icon={s.icon} accent={s.accent}
                    active={taskFilter === s.key || (s.key === "total" && taskFilter === "all")}
                    onClick={() => setTaskFilter(s.key === "total" ? "all" : (taskFilter === s.key ? "all" : s.key))}
                  />
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              {/* Search */}
              <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.sub, fontSize: 14, pointerEvents: "none" }}>⌕</span>
                <input placeholder="Search by title, description, assignee…" value={taskSearch} onChange={e => setTaskSearch(e.target.value)} style={{ ...S.input, width: "100%", paddingLeft: 34 }} />
              </div>
              {/* Filter pills */}
              <FilterBar options={TASK_FILTER_OPTS} active={taskFilter} onChange={setTaskFilter} />
              {/* Sort */}
              <select value={taskSort} onChange={e => setTaskSort(e.target.value)} style={{ ...S.input, width: "auto", paddingRight: 28, cursor: "pointer" }}>
                <option value="newest">↓ Newest</option>
                <option value="oldest">↑ Oldest</option>
                <option value="priority">⚑ Priority</option>
                <option value="title">Az Title</option>
              </select>
            </div>

            <SectionRow label={taskFilter === "all" ? "All Tasks" : taskFilter} count={filteredTasks.length} onRefresh={fetchData} />

            {loading ? <EmptyState icon="⏳" text="Loading…" /> :
              filteredTasks.length === 0
                ? <EmptyState icon="📋" text={taskSearch ? `No results for "${taskSearch}"` : `No ${taskFilter === "all" ? "" : taskFilter + " "}tasks found.`} />
                : filteredTasks.map(task => <TaskCard key={task._id} task={task} />)
            }
          </>
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
            {[
              { label: "Task Title *", key: "title", placeholder: "e.g. Complete Q4 Report", type: "input" },
              { label: "Description",  key: "description", placeholder: "Optional details…", type: "textarea" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, display: "block", marginBottom: 6 }}>{f.label}</label>
                {f.type === "input"
                  ? <input placeholder={f.placeholder} style={S.input} value={taskForm[f.key]} onChange={e => setTaskForm({ ...taskForm, [f.key]: e.target.value })} />
                  : <textarea placeholder={f.placeholder} style={{ ...S.input, minHeight: 82, resize: "vertical" }} value={taskForm[f.key]} onChange={e => setTaskForm({ ...taskForm, [f.key]: e.target.value })} />
                }
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, display: "block", marginBottom: 6 }}>Priority</label>
              <select style={S.input} value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div style={{ height: 1, background: C.border, margin: "2px 0" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowAssignModal(null); setTaskForm({ title: "", description: "", priority: "medium" }); }} style={{ ...S.btn("ghost"), flex: 1 }}>Cancel</button>
              <button onClick={handleAssignTask} style={{ ...S.btn("primary"), flex: 2 }}>Assign Task</button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}