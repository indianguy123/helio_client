export default function ProgressBar({ progress = 0, status = "running", label = "Analysis progress" }) {
  const barColor =
    status === "done" ? "bg-emerald-500" : status === "failed" ? "bg-red-500" : "bg-blue-500";
  return (
    <div className="w-full rounded-lg border bg-white p-3">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded bg-slate-100">
        <div className={`h-full transition-all duration-500 ${barColor}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
