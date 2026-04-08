import { useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../shared/StatusBadge";

export default function InsightCard({ issue }) {
  const [open, setOpen] = useState(false);
  const borderColor = issue.severity === "high" ? "border-red-500" : issue.severity === "medium" ? "border-orange-500" : "border-yellow-400";

  return (
    <div className={`rounded-lg border-l-4 ${borderColor} border bg-white p-4`}>
      <div className="mb-2 flex items-center gap-2">
        <StatusBadge status={issue.severity} />
        <h4 className="font-semibold">{issue.type}</h4>
      </div>
      <p className="text-sm text-slate-600">{issue.description}</p>
      <p className="mt-2 text-sm font-medium">Count: {issue.count}</p>
      <button className="mt-3 text-sm text-blue-600" onClick={() => setOpen((v) => !v)}>
        View {issue.examples?.length || 0} examples
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {(issue.quotes || []).map((q, idx) => (
            <p key={idx} className="rounded bg-slate-50 p-2 text-xs">{q}</p>
          ))}
          <div className="flex flex-wrap gap-2">
            {(issue.examples || []).map((sessionId) => (
              <Link key={sessionId} to={`/conversations/${sessionId}`} className="text-xs text-blue-600 underline">
                {sessionId}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
