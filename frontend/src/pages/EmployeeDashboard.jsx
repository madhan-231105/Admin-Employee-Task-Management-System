import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

// ─── EXACT COLOR PALETTE ──────────────────────────────────────────────────────
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

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending:     { color: C.warning, bg: "rgba(242,153,74,0.13)",  icon: "⏳", label: "Pending"     },
  "In Progress":{ color: C.info,   bg: "rgba(168,196,220,0.13)", icon: "🔄", label: "In Progress" },
  Completed:   { color: C.success, bg: "rgba(111,207,151,0.13)", icon: "✅", label: "Completed"   },
};

const PRIORITY_CONFIG = {
  high:   { color: C.danger,  border: C.danger  },
  medium: { color: C.warning, border: C.warning },
  low:    { color: C.success, border: C.success },
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const card = {
  background: C.secondhand,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
};

const S = {
  input: {
    background: C.slate,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "10px 14px",
    color: C.whitish,
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color .2s, box-shadow .2s",
    boxSizing: "border-box",
  },
  btn: (v = "default") => ({
    padding: "8px 16px",
    borderRadius: 9,
    border: "none",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all .18s",
    letterSpacing: ".3px",
    ...(v === "primary"   && { background: C.whitish,  color: C.slate,  boxShadow: "0 2px 10px rgba(245,245,245,0.12)" }),
    ...(v === "ghost"     && { background: "transparent", color: C.lightGrey, border: `1px solid ${C.border}` }),
    ...(v === "subtle"    && { background: "rgba(245,245,245,0.06)", color: C.lightGrey, border: `1px solid ${C.border}` }),
    ...(v === "pending"   && { background: "rgba(242,153,74,0.13)",  color: C.warning, border: `1px solid rgba(242,153,74,0.3)` }),
    ...(v === "progress"  && { background: "rgba(168,196,220,0.13)", color: C.info,    border: `1px solid rgba(168,196,220,0.3)` }),
    ...(v === "completed" && { background: "rgba(111,207,151,0.13)", color: C.success, border: `1px solid rgba(111,207,151,0.3)` }),
    ...(v === "active-pending"   && { background: C.warning, color: C.slate }),
    ...(v === "active-progress"  && { background: C.info,    color: C.slate }),
    ...(v === "active-completed" && { background: C.success, color: C.slate }),
  }),
  badge: (status) => {
    const cfg = STATUS_CONFIG[status] || { color: C.muted, bg: "rgba(220,220,220,0.07)" };
    return {
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 99,
      fontSize: 10, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: ".6px",
      background: cfg.bg, color: cfg.color,
    };
  },
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, accent, icon, onClick, active }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...card,
        padding: "1.2rem 1.4rem",
        borderTop: `3px solid ${accent}`,
        cursor: onClick ? "pointer" : "default",
        transition: "transform .18s, box-shadow .18s, border-color .18s",
        outline: active ? `2px solid ${accent}` : "none",
        outlineOffset: 2,
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.32)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <span style={{ position: "absolute", right: 14, top: 10, fontSize: 36, opacity: 0.07, userSelect: "none" }}>{icon}</span>
      <p style={{ margin: 0, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700 }}>{label}</p>
      <h2 style={{ margin: "7px 0 12px", fontSize: 34, fontWeight: 800, color: C.whitish, lineHeight: 1 }}>{value}</h2>
      <div style={{ height: 2, background: C.border, borderRadius: 99 }}>
        <div style={{ height: "100%", width: `${Math.min(Math.max((value / 10) * 100, 8), 100)}%`, background: accent, borderRadius: 99, opacity: 0.75, transition: "width 1.2s cubic-bezier(.16,1,.3,1)" }} />
      </div>
    </div>
  );
}

// ─── TASK CARD ────────────────────────────────────────────────────────────────
function TaskCard({ task, onUpdate }) {
  const pc    = PRIORITY_CONFIG[task.priority?.toLowerCase()] || { color: C.sub, border: C.sub };
  const sc    = STATUS_CONFIG[task.status] || STATUS_CONFIG["Pending"];
  const statuses = ["Pending", "In Progress", "Completed"];

  return (
    <div style={{
      ...card,
      borderLeft: `3px solid ${pc.border}`,
      padding: "1.2rem 1.4rem",
      transition: "background .18s, box-shadow .18s",
      animation: "fadeUp .22s ease both",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "#474747"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.28)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = C.secondhand; e.currentTarget.style.boxShadow = ""; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        {/* Left: title + description */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.whitish }}>{task.title}</h3>
            <span style={S.badge(task.status)}>{sc.icon} {task.status}</span>
            {task.priority && (
              <span style={{
                display: "inline-flex", alignItems: "center",
                padding: "3px 9px", borderRadius: 99,
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px",
                background: `${pc.color}18`, color: pc.color,
              }}>{task.priority}</span>
            )}
          </div>
          {task.description && (
            <p style={{ margin: 0, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{task.description}</p>
          )}
        </div>

        {/* Right: status buttons */}
        <div style={{ display: "flex", gap: 7, flexShrink: 0, flexWrap: "wrap" }}>
          {statuses.map(s => {
            const isActive = task.status === s;
            const vMap = { "Pending": isActive ? "active-pending" : "pending", "In Progress": isActive ? "active-progress" : "progress", "Completed": isActive ? "active-completed" : "completed" };
            return (
              <button
                key={s}
                onClick={() => !isActive && onUpdate(task._id, s)}
                disabled={isActive}
                style={{
                  ...S.btn(vMap[s]),
                  cursor: isActive ? "default" : "pointer",
                  opacity: isActive ? 1 : 0.75,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.opacity = "0.75"; }}
              >{s}</button>
            );
          })}
        </div>
      </div>
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

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");       // All | Pending | In Progress | Completed
  const [sortBy, setSortBy]     = useState("newest");    // newest | oldest | priority | title

  // ── Auth Guard + back-button block ──────────────────────────────────────────
  useEffect(() => {
    const user  = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    if (!user || !token) { navigate("/", { replace: true }); return; }

    window.history.pushState(null, "", window.location.href);
    const blockBack = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/tasks/${user.id}`);
      setTasks(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t));
    try {
      await API.patch(`/tasks/${id}`, { status });
    } catch (err) {
      console.error(err);
      fetchTasks(); // rollback on failure
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  // ── Derived data ─────────────────────────────────────────────────────────────
  const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

  const processed = tasks
    .filter(t => {
      const matchSearch = [t.title, t.description].some(v => v?.toLowerCase().includes(search.toLowerCase()));
      const matchFilter = filter === "All" || t.status === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortBy === "newest")   return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")   return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "priority") return (PRIORITY_ORDER[a.priority?.toLowerCase()] ?? 9) - (PRIORITY_ORDER[b.priority?.toLowerCase()] ?? 9);
      if (sortBy === "title")    return a.title.localeCompare(b.title);
      return 0;
    });

  const counts = {
    All:          tasks.length,
    Pending:      tasks.filter(t => t.status === "Pending").length,
    "In Progress":tasks.filter(t => t.status === "In Progress").length,
    Completed:    tasks.filter(t => t.status === "Completed").length,
  };

  const FILTER_TABS = [
    { key: "All",         accent: C.lightGrey, icon: "📋" },
    { key: "Pending",     accent: C.warning,   icon: "⏳" },
    { key: "In Progress", accent: C.info,      icon: "🔄" },
    { key: "Completed",   accent: C.success,   icon: "✅" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: C.slate,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: C.whitish,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.slate}; }
        ::-webkit-scrollbar-thumb { background: ${C.secondhand}; border-radius: 99px; }
        input:focus, select:focus {
          border-color: ${C.lightGrey} !important;
          box-shadow: 0 0 0 3px rgba(220,220,220,0.09) !important;
        }
        button:active { transform: scale(.97); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
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
            background: C.slate, border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>🗂️</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: C.whitish, letterSpacing: "-.3px" }}>Work Desk</span>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: C.muted,
            textTransform: "uppercase", background: "rgba(245,245,245,0.05)",
            padding: "2px 8px", borderRadius: 4, border: `1px solid ${C.border}`,
          }}>EMPLOYEE</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.whitish }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{user?.department || "Team Member"}</div>
          </div>
          {/* Avatar */}
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "#4a4a4a", border: `2px solid #5c5c5c`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: C.lightGrey,
          }}>
            {user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <div style={{ width: 1, height: 24, background: C.border }} />
          <button onClick={handleSignOut} style={S.btn("ghost")}>Sign out</button>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ── Stat Cards ───────────────────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14, marginBottom: "2rem",
        }}>
          {FILTER_TABS.map((f, i) => (
            <div key={f.key} style={{ animation: `fadeUp .25s ease ${i * 0.06}s both` }}>
              <StatCard
                label={f.key === "All" ? "Total Tasks" : f.key}
                value={counts[f.key]}
                accent={f.accent}
                icon={f.icon}
                active={filter === f.key}
                onClick={() => setFilter(f.key)}
              />
            </div>
          ))}
        </div>

        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", gap: 10, alignItems: "center",
          marginBottom: "1.25rem", flexWrap: "wrap",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <span style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              color: C.sub, fontSize: 14, pointerEvents: "none",
            }}>⌕</span>
            <input
              placeholder="Search tasks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...S.input, width: "100%", paddingLeft: 34 }}
            />
          </div>

          {/* Filter pill tabs */}
          <div style={{
            display: "flex", gap: 2,
            background: C.secondhand, padding: 4, borderRadius: 11,
            border: `1px solid ${C.border}`,
          }}>
            {FILTER_TABS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                background: filter === f.key ? C.slate : "transparent",
                border: filter === f.key ? `1px solid #555` : "1px solid transparent",
                color: filter === f.key ? C.whitish : C.muted,
                padding: "6px 14px", borderRadius: 8,
                cursor: "pointer", fontSize: 12, fontWeight: 700,
                transition: "all .18s", fontFamily: "inherit",
                boxShadow: filter === f.key ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
              }}>
                {f.icon} {f.key}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ ...S.input, width: "auto", paddingRight: 32, cursor: "pointer" }}
          >
            <option value="newest">↓ Newest</option>
            <option value="oldest">↑ Oldest</option>
            <option value="priority">⚑ Priority</option>
            <option value="title">Az Title</option>
          </select>
        </div>

        {/* ── Section Row ──────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: C.lightGrey, whiteSpace: "nowrap" }}>
            {filter === "All" ? "All Tasks" : filter}
            <span style={{ marginLeft: 7, fontSize: 11, color: C.sub, fontWeight: 500 }}>
              ({processed.length})
            </span>
          </h2>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <button onClick={fetchTasks} style={{ ...S.btn("subtle"), padding: "6px 14px", fontSize: 12 }}>
            ↺ Refresh
          </button>
        </div>

        {/* ── Task List ────────────────────────────────────────────────────── */}
        {loading ? (
          <EmptyState icon="⏳" text="Loading tasks…" />
        ) : processed.length === 0 ? (
          <EmptyState
            icon={filter === "Completed" ? "✅" : filter === "Pending" ? "⏳" : "📋"}
            text={search ? `No tasks matching "${search}"` : `No ${filter === "All" ? "" : filter.toLowerCase() + " "}tasks found.`}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {processed.map(task => (
              <TaskCard key={task._id} task={task} onUpdate={updateStatus} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}