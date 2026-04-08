const colorMap = {
  pending: "bg-slate-100 text-slate-700",
  running: "bg-blue-100 text-blue-700",
  done: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  high: "bg-red-100 text-red-700",
  medium: "bg-orange-100 text-orange-700",
  low: "bg-yellow-100 text-yellow-700",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colorMap[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
