import { useEffect, useMemo, useState, useRef, useCallback } from "react";
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

  // Re-analyze state
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null); // null | "pending" | "running" | "done" | "failed"
  const [jobProgress, setJobProgress] = useState(0);
  const [jobError, setJobError] = useState("");
  const pollRef = useRef(null);

  useEffect(() => {
    get(`/api/insights/${brandId}/history`).then((res) => setHistory(res.data)).catch(() => setHistory([]));
  }, [brandId]);

  // Poll job status
  const pollJob = useCallback(async (id) => {
    try {
      const { data } = await get(`/api/jobs/${id}`);
      setJobStatus(data.status);
      setJobProgress(data.progress || 0);

      if (data.status === "done") {
        clearInterval(pollRef.current);
        pollRef.current = null;
        setJobId(null);
        setJobError("");
        // Refresh insights after a short delay
        setTimeout(() => refetch(), 500);
      } else if (data.status === "failed") {
        clearInterval(pollRef.current);
        pollRef.current = null;
        setJobId(null);
        setJobError(data.errorMessage || "Analysis failed");
      }
    } catch {
      // Silently continue polling
    }
  }, [refetch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleReanalyze = async () => {
    setJobError("");
    try {
      const { data } = await post("/api/jobs/start", { brandId });
      setJobId(data.jobId);
      setJobStatus("pending");
      setJobProgress(0);

      // Start polling every 2 seconds
      pollRef.current = setInterval(() => pollJob(data.jobId), 2000);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to start analysis";
      setJobError(msg);
    }
  };

  const isJobRunning = jobStatus === "pending" || jobStatus === "running";

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

  // Compute frustration rate from frustration signals
  const frustrationCount = insight?.frustrationSignals?.length || 0;
  const totalConversations = insight?.summary?.totalConversations || 0;
  const frustrationRate = totalConversations ? Math.round((frustrationCount / totalConversations) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold sm:text-2xl">{brandId}</h2>
          <button
            className="rounded bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            onClick={handleReanalyze}
            disabled={isJobRunning}
          >
            {isJobRunning ? "Analyzing..." : "Re-analyze"}
          </button>
        </div>

        {/* Progress Bar */}
        {isJobRunning && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-blue-700">
                {jobStatus === "pending" ? "Starting analysis..." : "Analysis in progress..."}
              </span>
              <span className="font-semibold text-blue-800">{jobProgress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-blue-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${jobProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success message */}
        {jobStatus === "done" && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            ✅ Analysis complete! Results updated below.
          </div>
        )}

        {/* Error message */}
        {jobError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            ❌ {jobError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded border bg-white p-4">Total conversations: {totalConversations}</div>
          <div className="rounded border bg-white p-4">Frustration rate: {frustrationRate}%</div>
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
