import { COLORS } from "../theme";
export default function Avatar({ name, size = 38 }) {
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const hue = (name.charCodeAt(0) * 137) % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `hsl(${hue}, 35%, 35%)`, border: `2px solid hsl(${hue}, 35%, 50%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700, color: `hsl(${hue}, 60%, 85%)`, flexShrink: 0 }}>
      {initials}
    </div>
  );
}