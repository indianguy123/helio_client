import { BarChart3, Building2, CheckCircle2, AlertTriangle } from "lucide-react";

const cards = [
  { key: "totalBrands", label: "Total Brands", icon: Building2 },
  { key: "totalConversations", label: "Total Conversations", icon: BarChart3 },
  { key: "avgResolutionRate", label: "Avg Resolution Rate", icon: CheckCircle2 },
  { key: "mostCommonIssue", label: "Most Common Issue", icon: AlertTriangle },
];

export default function SummaryCards({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="rounded-lg border bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-slate-500">{card.label}</p>
              <Icon className="h-4 w-4 text-slate-500" />
            </div>
            <p className="text-2xl font-bold">{stats?.[card.key] ?? "-"}</p>
          </div>
        );
      })}
    </div>
  );
}
