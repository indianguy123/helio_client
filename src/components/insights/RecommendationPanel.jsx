export default function RecommendationPanel({ recommendations = [] }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-3 font-semibold">Recommendations</h3>
      <div className="space-y-3">
        {recommendations
          .sort((a, b) => a.priority - b.priority)
          .map((rec) => (
            <div key={rec.action} className="rounded border p-3">
              <p className="font-medium">
                #{rec.priority} - {rec.action}
              </p>
              <p className="text-sm text-slate-600">{rec.reason}</p>
              <p className="text-xs text-slate-500">Impact: {rec.estimatedImpact}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
