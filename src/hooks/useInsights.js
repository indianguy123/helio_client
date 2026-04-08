import { useCallback, useEffect, useState } from "react";
import { get } from "../services/api";

export default function useInsights(brandId) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    if (!brandId) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await get(`/api/insights/${brandId}`);
      setInsight(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { insight, loading, error, refetch };
}
