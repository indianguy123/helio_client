import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ConversationThread from "../components/conversations/ConversationThread";
import { get } from "../services/api";

const severityStyles = {
  high: {
    border: "border-red-300",
    bg: "bg-red-50",
    badge: "bg-red-500",
    text: "text-red-800",
    accent: "text-red-600",
  },
  medium: {
    border: "border-orange-300",
    bg: "bg-orange-50",
    badge: "bg-orange-500",
    text: "text-orange-800",
    accent: "text-orange-600",
  },
  low: {
    border: "border-yellow-300",
    bg: "bg-yellow-50",
    badge: "bg-yellow-500",
    text: "text-yellow-800",
    accent: "text-yellow-600",
  },
};

export default function ConversationPage() {
  const { sessionId } = useParams();
  const location = useLocation();
  const issueContext = location.state?.issue || null;

  const [messages, setMessages] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandId, setBrandId] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await get(`/api/conversations/session/${sessionId}`);
        setMessages(data.messages || []);
        const bId = data.conversation?.brand_id;
        setBrandId(bId);

        // If issue context has quotes, use those for highlighting.
        // Otherwise fallback to fetching all issue quotes from brand insights.
        if (issueContext?.quotes?.length) {
          setQuotes(issueContext.quotes);
        } else if (bId) {
          try {
            const insight = await get(`/api/insights/${bId}`);
            const q = (insight.data.issues || []).flatMap((i) => i.quotes || []);
            setQuotes(q);
          } catch {
            setQuotes([]);
          }
        }
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId, issueContext]);

  const styles = severityStyles[issueContext?.severity] || severityStyles.medium;

  return (
    <Layout>
      {/* Issue context banner */}
      {issueContext && (
        <div className={`mb-4 rounded-lg border ${styles.border} ${styles.bg} p-4`}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`rounded px-2 py-0.5 text-xs font-semibold text-white ${styles.badge}`}>
              {issueContext.severity}
            </span>
            <h3 className={`text-base font-bold ${styles.text}`}>
              Flagged Issue: {issueContext.type}
            </h3>
          </div>
          <p className={`text-sm ${styles.accent}`}>{issueContext.description}</p>
          {issueContext.quotes?.length > 0 && (
            <div className="mt-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Flagged quotes
              </p>
              <div className="space-y-1">
                {issueContext.quotes.map((q, idx) => (
                  <p key={idx} className="rounded bg-white/70 px-3 py-1.5 text-xs text-slate-700 border border-slate-200">
                    "{q}"
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="break-all text-lg font-bold sm:text-xl">Session: {sessionId}</h2>
        {brandId && (
          <Link to={`/brands/${brandId}`} className="text-sm text-blue-600 hover:underline">
            ← Back to brand
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center text-sm text-slate-500">
          No messages found for this session.
        </div>
      ) : (
        <ConversationThread messages={messages} highlightedQuotes={quotes} />
      )}
    </Layout>
  );
}
