import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-3">
      <h1 className="text-lg font-semibold">Conversation Analysis</h1>
      <button onClick={logout} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
        Logout
      </button>
    </header>
  );
}
