import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/upload", label: "Upload" },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="w-56 border-r bg-white p-4">
      <h2 className="mb-4 text-lg font-bold">AI Insights</h2>
      <nav className="space-y-2">
        {links.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`block rounded px-3 py-2 text-sm ${location.pathname.startsWith(item.to) ? "bg-blue-100 text-blue-700" : "text-slate-700 hover:bg-slate-100"}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
