import { Link } from "react-router-dom";

export default function ConversationTable({ conversations = [] }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="p-3">Session</th>
            <th className="p-3">Category</th>
            <th className="p-3">Resolved</th>
            <th className="p-3">Duration</th>
          </tr>
        </thead>
        <tbody>
          {conversations.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-3">
                <Link className="text-blue-600 underline" to={`/conversations/${c.session_id}`}>
                  {c.session_id}
                </Link>
              </td>
              <td className="p-3">{c.metadata?.product_category || "-"}</td>
              <td className="p-3">{c.resolved ? "Yes" : "No"}</td>
              <td className="p-3">{c.metadata?.duration_seconds || 0}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
