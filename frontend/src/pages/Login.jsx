import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const COLORS = {
  slate: "#262626",
  secondhand: "#3f3f3f",
  whitish: "#f5f5f5",
  lightGrey: "#dcdcdc",
  accent: "#c8a97e",
  danger: "#c0392b",
  success: "#27ae60",
  info: "#2980b9",
};

const S = {
  app: {
    minHeight: "100vh",
    background: COLORS.slate,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: COLORS.whitish,
  },
  card: {
    background: COLORS.secondhand,
    border: `1px solid #555`,
    borderRadius: 12,
    padding: "1.5rem",
  },
  input: {
    width: "100%",
    background: COLORS.slate,
    border: `1px solid #555`,
    borderRadius: 8,
    padding: "10px 14px",
    color: COLORS.whitish,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  btn: (variant = "primary") => ({
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
    background:
      variant === "primary"
        ? COLORS.accent
        : variant === "ghost"
        ? "transparent"
        : COLORS.secondhand,
    color:
      variant === "ghost"
        ? COLORS.lightGrey
        : variant === "primary"
        ? COLORS.slate
        : COLORS.whitish,
    border: variant === "ghost" ? `1px solid #555` : "none",
  }),
};

function InputField({ label, type = "text", value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: COLORS.lightGrey,
          marginBottom: 6,
          letterSpacing: "0.3px",
          textTransform: "uppercase",
        }}
      >
        {label}
        {required && <span style={{ color: COLORS.accent, marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...S.input,
          borderColor: focused ? COLORS.accent : "#555",
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("employee");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

const handleLogin = async () => {
    try {
      const { data } = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // This line moves the user to the admin page
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
};

  const handleRegister = async () => {
    setError("");
    if (!form.name || !form.email || !form.password || !form.department) {
      setError("All fields are required.");
      return;
    }
    try {
      await API.post("/auth/register", form);
      setSuccess("Registration successful! Await admin approval.");
      setMode("login");
      setForm({ name: "", email: "", password: "", department: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div
      style={{
        ...S.app,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:none;} }
        input::placeholder { color: #666; }
        button:hover { opacity: 0.88; }
        button:active { transform: scale(0.98); }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.3s ease" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: COLORS.accent,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                stroke={COLORS.slate}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect x="9" y="3" width="6" height="4" rx="1" stroke={COLORS.slate} strokeWidth="2" />
              <path d="M9 12h6M9 16h4" stroke={COLORS.slate} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 700,
              fontFamily: "'DM Serif Display', serif",
              letterSpacing: "-0.5px",
            }}
          >
            TaskFlow
          </h1>
          <p style={{ margin: "6px 0 0", color: "#888", fontSize: 13 }}>
            Workforce Task Management
          </p>
        </div>

        <div style={S.card}>
          {mode === "login" ? (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: "1.5rem",
                  background: COLORS.slate,
                  borderRadius: 10,
                  padding: 4,
                }}
              >
                {["employee", "admin"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    style={{
                      ...S.btn(role === r ? "primary" : "ghost"),
                      flex: 1,
                      border: "none",
                      borderRadius: 7,
                      fontSize: 13,
                      textTransform: "capitalize",
                    }}
                  >
                    {r === "admin" ? "Admin" : "Employee"}
                  </button>
                ))}
              </div>

              {role === "admin" && (
                <div
                  style={{
                    background: "#1a1a2e",
                    border: `1px solid ${COLORS.info}40`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginBottom: "1rem",
                    fontSize: 12,
                    color: COLORS.info,
                  }}
                >
                  Default: admin@system.com / admin123
                </div>
              )}

              {success && (
                <div
                  style={{
                    background: "#0e2e1a",
                    border: `1px solid ${COLORS.success}50`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginBottom: "1rem",
                    fontSize: 13,
                    color: COLORS.success,
                  }}
                >
                  {success}
                </div>
              )}

              <InputField label="Email" type="email" value={form.email} onChange={f("email")} placeholder="you@company.com" required />
              <InputField label="Password" type="password" value={form.password} onChange={f("password")} placeholder="••••••••" required />

              {error && (
                <p style={{ color: COLORS.danger, fontSize: 13, margin: "0 0 1rem" }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleLogin}
                style={{ ...S.btn("primary"), width: "100%", padding: "12px" }}
              >
                Sign In
              </button>

              {role === "employee" && (
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "1.25rem",
                    fontSize: 13,
                    color: "#888",
                  }}
                >
                  No account?{" "}
                  <span
                    onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
                    style={{ color: COLORS.accent, cursor: "pointer", fontWeight: 600 }}
                  >
                    Register here
                  </span>
                </p>
              )}
            </>
          ) : (
            <>
              <h3 style={{ margin: "0 0 1.25rem", fontSize: 16, fontWeight: 600 }}>
                Employee Registration
              </h3>
              <InputField label="Full Name" value={form.name} onChange={f("name")} placeholder="Jane Smith" required />
              <InputField label="Email" type="email" value={form.email} onChange={f("email")} placeholder="jane@company.com" required />
              <InputField label="Department" value={form.department} onChange={f("department")} placeholder="e.g. Engineering" required />
              <InputField label="Password" type="password" value={form.password} onChange={f("password")} placeholder="••••••••" required />

              {error && (
                <p style={{ color: COLORS.danger, fontSize: 13, margin: "0 0 1rem" }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleRegister}
                style={{ ...S.btn("primary"), width: "100%", padding: "12px" }}
              >
                Create Account
              </button>
              <p
                style={{ textAlign: "center", marginTop: "1rem", fontSize: 13, color: "#888" }}
              >
                Already registered?{" "}
                <span
                  onClick={() => { setMode("login"); setError(""); }}
                  style={{ color: COLORS.accent, cursor: "pointer", fontWeight: 600 }}
                >
                  Sign in
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}