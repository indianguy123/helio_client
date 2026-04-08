import { useEffect, useState } from "react";
import { get } from "../services/api";

export default function useJobPoller(jobId) {
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) return undefined;
    let timer;
    let mounted = true;

    const poll = async () => {
      try {
        const { data } = await get(`/api/jobs/${jobId}`);
        if (!mounted) return;
        setStatus(data.status);
        setProgress(data.progress || 0);
        setError(data.errorMessage || "");
        if (data.status === "done" || data.status === "failed") {
          clearInterval(timer);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.error || err.message);
      }
    };

    poll();
    timer = setInterval(poll, 2000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [jobId]);

  return { status, progress, error };
}
