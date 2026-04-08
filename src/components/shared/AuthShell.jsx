import AuthScene from "./AuthScene";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-100 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.1),_transparent_35%)]" />
      <AuthScene />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur sm:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}
