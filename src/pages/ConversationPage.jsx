import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ConversationThread from "../components/conversations/ConversationThread";
import { get } from "../services/api";

export default function ConversationPage() {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await get(`/api/conversations/session/${sessionId}`);
      setMessages(data.messages || []);
      const brandId = data.conversation?.brand_id;
      if (brandId) {
        try {
          const insight = await get(`/api/insights/${brandId}`);
          const q = (insight.data.issues || []).flatMap((i) => i.quotes || []);
          setQuotes(q);
        } catch {
          setQuotes([]);
        }
      }
    }
    load();
  }, [sessionId]);

  return (
    <Layout>
      <h2 className="mb-4 text-xl font-bold">Session: {sessionId}</h2>
      <ConversationThread messages={messages} highlightedQuotes={quotes} />
    </Layout>
  );
}
