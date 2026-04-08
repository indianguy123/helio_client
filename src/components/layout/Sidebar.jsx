import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload", icon: Upload },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  return (
    <>
      {isOpen && <button className="fixed inset-0 z-20 bg-slate-900/25 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200/80 bg-white/95 p-5 backdrop-blur transition-transform lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="mb-1 text-lg font-bold tracking-tight">AI Insights</h2>
        <p className="mb-5 text-xs text-slate-500">Conversation quality intelligence</p>
        <nav className="space-y-2">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  location.pathname.startsWith(item.to)
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
