import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/shared/AuthShell";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access brand insights and AI diagnostics."
      footer={
        <p className="mt-4 text-center text-sm text-slate-600">
          New user?{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
            Create account
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit}>
        <input
          className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none ring-blue-500/40 transition focus:ring"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none ring-blue-500/40 transition focus:ring"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-lg bg-blue-600 p-2.5 font-medium text-white transition hover:bg-blue-700">
          Sign in
        </button>
      </form>
    </AuthShell>
  );
}
