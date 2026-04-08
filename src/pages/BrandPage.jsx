import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Layout from "../components/layout/Layout";
import SentimentChart from "../components/dashboard/SentimentChart";
import InsightList from "../components/insights/InsightList";
import RecommendationPanel from "../components/insights/RecommendationPanel";
import { get, post } from "../services/api";
import useInsights from "../hooks/useInsights";

export default function BrandPage() {
  const { brandId } = useParams();
  const { insight, refetch } = useInsights(brandId);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    get(`/api/insights/${brandId}/history`).then((res) => setHistory(res.data)).catch(() => setHistory([]));
  }, [brandId]);

  const sentimentData = useMemo(
    () =>
      history.map((h) => ({
        date: new Date(h.generatedAt).toLocaleDateString(),
        score: h.summary?.overallSentiment === "positive" ? 1 : h.summary?.overallSentiment === "neutral" ? 0.5 : 0,
      })),
    [history]
  );

  const topicData = useMemo(() => {
    const well = insight?.topicAnalysis?.wellHandled || [];
    const poor = insight?.topicAnalysis?.poorlyHandled || [];
    const byTopic = new Map();
    well.forEach((t) => byTopic.set(t.topic, { topic: t.topic, well: t.count || 0, poor: 0 }));
    poor.forEach((t) => {
      const existing = byTopic.get(t.topic) || { topic: t.topic, well: 0, poor: 0 };
      existing.poor = t.count || 0;
      byTopic.set(t.topic, existing);
    });
    return [...byTopic.values()].slice(0, 8);
  }, [insight]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{brandId}</h2>
          <button className="rounded bg-blue-600 px-3 py-2 text-sm text-white" onClick={async () => { await post("/api/jobs/start", { brandId }); refetch(); }}>
            Re-analyze
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded border bg-white p-4">Total conversations: {insight?.summary?.totalConversations || 0}</div>
          <div className="rounded border bg-white p-4">Resolution rate: {Math.round((insight?.summary?.resolutionRate || 0) * 100)}%</div>
          <div className="rounded border bg-white p-4">Avg duration: {Math.round(insight?.summary?.avgDurationSeconds || 0)}s</div>
          <div className="rounded border bg-white p-4">Sentiment: {insight?.summary?.overallSentiment || "-"}</div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SentimentChart data={sentimentData} />
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 font-semibold">Topic Breakdown</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topicData}>
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="well" fill="#22c55e" />
                <Bar dataKey="poor" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <InsightList issues={insight?.issues || []} />
        <RecommendationPanel recommendations={insight?.recommendations || []} />
      </div>
    </Layout>
  );
}
