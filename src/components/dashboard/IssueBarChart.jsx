import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const severityColor = { high: "#ef4444", medium: "#f97316", low: "#eab308" };

export default function IssueBarChart({ data = [] }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-3 font-semibold">Issue Frequency</h3>
      {data.length === 0 && (
        <p className="mb-2 text-sm text-slate-500">
          No issue data yet. Run analysis for at least one brand to populate this chart.
        </p>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip formatter={(value, name, item) => [value, `${name} (${item.payload.description || ""})`]} />
          <Bar dataKey="count">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={severityColor[entry.severity] || "#94a3b8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
