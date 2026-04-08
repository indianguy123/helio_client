import { useEffect, useState } from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from "recharts";
import { get } from "../../services/api";

export default function BrandCompareChart({ brandId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!brandId) return;
    get(`/api/insights/${brandId}/compare`).then((res) => setData(res.data)).catch(() => setData([]));
  }, [brandId]);

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-3 font-semibold">Brand Comparison</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="brandId" />
          <Radar name="Resolution Rate" dataKey="resolutionRate" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
          <Radar name="Sentiment" dataKey="sentimentScore" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} />
          <Radar name="Low Issues" dataKey="lowIssueCount" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
          <Radar name="Topic Coverage" dataKey="topicCoverage" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
