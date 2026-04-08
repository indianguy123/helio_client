import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SummaryCards from "../components/dashboard/SummaryCards";
import IssueBarChart from "../components/dashboard/IssueBarChart";
import BrandCompareChart from "../components/dashboard/BrandCompareChart";
import ProgressBar from "../components/shared/ProgressBar";
import useBrands from "../hooks/useBrands";
import useJobPoller from "../hooks/useJobPoller";
import { get, post } from "../services/api";

export default function DashboardPage() {
  const { brands, loading } = useBrands();
  const [jobId, setJobId] = useState("");
  const [issueData, setIssueData] = useState([]);
  const { status, progress } = useJobPoller(jobId);

  useEffect(() => {
    let mounted = true;
    const loadIssueData = async () => {
      if (!brands.length) {
        if (mounted) setIssueData([]);
        return;
      }

      const issueMap = new Map();
      for (const brand of brands) {
        try {
          const { data } = await get(`/api/insights/${brand.brandId}`);
          const issues = data?.issues || [];
          for (const issue of issues) {
            const key = issue.type || "unknown";
            const current = issueMap.get(key) || {
              type: key,
              severity: issue.severity || "low",
              count: 0,
              description: issue.description || "",
            };
            current.count += Number(issue.count || 0);
            if (!current.description && issue.description) current.description = issue.description;

            const severityRank = { low: 1, medium: 2, high: 3 };
            if (
              severityRank[issue.severity] &&
              severityRank[current.severity] &&
              severityRank[issue.severity] > severityRank[current.severity]
            ) {
              current.severity = issue.severity;
            }
            issueMap.set(key, current);
          }
        } catch {
          // brand can have no insight yet; skip it
        }
      }

      if (mounted) {
        const aggregated = [...issueMap.values()].sort((a, b) => b.count - a.count);
        setIssueData(aggregated);
      }
    };

    loadIssueData();
    return () => {
      mounted = false;
    };
  }, [brands, status]);

  const stats = useMemo(() => {
    const totalBrands = brands.length;
    const totalConversations = brands.reduce((a, b) => a + (b.totalConversations || 0), 0);
    const rates = brands.map((b) => b.resolutionRate).filter((v) => typeof v === "number");
    const avgResolutionRate = rates.length ? `${Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 100)}%` : "-";
    const mostCommonIssue = issueData.length ? issueData[0].type : "-";
    return { totalBrands, totalConversations, avgResolutionRate, mostCommonIssue };
  }, [brands, issueData]);

  const startAnalysis = async (brandId) => {
    const { data } = await post("/api/jobs/start", { brandId });
    setJobId(data.jobId);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <SummaryCards stats={stats} />
        {jobId && <ProgressBar progress={progress} status={status} label="Brand analysis" />}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <IssueBarChart data={issueData} />
          <BrandCompareChart brandId={brands[0]?.brandId} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {!loading &&
            brands.map((brand) => (
              <div key={brand.brandId} className="rounded-lg border bg-white p-4">
                <h3 className="font-semibold">{brand.displayName}</h3>
                <p className="text-sm text-slate-600">Conversations: {brand.totalConversations}</p>
                <p className="text-sm text-slate-600">
                  Resolution rate: {typeof brand.resolutionRate === "number" ? `${Math.round(brand.resolutionRate * 100)}%` : "-"}
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <button className="rounded bg-blue-600 px-3 py-2 text-sm text-white" onClick={() => startAnalysis(brand.brandId)}>
                    Analyze now
                  </button>
                  <Link className="rounded border px-3 py-2 text-center text-sm" to={`/brands/${brand.brandId}`}>
                    View insights
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
}
