import InsightCard from "./InsightCard";

export default function InsightList({ issues = [] }) {
  return (
    <div className="space-y-3">
      {issues.map((issue, idx) => (
        <InsightCard key={`${issue.type}-${idx}`} issue={issue} />
      ))}
    </div>
  );
}
