import { useAuth } from "../../context/AuthContext";
import { LogOut, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  const { logout } = useAuth();
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="inline-flex rounded-lg border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-base font-semibold tracking-tight sm:text-lg">Conversation Analysis</h1>
          <p className="hidden text-xs text-slate-500 sm:block">Monitor assistant quality, issues and trends</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
}
