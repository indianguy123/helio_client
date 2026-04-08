import { useEffect, useState } from "react";
import { get } from "../services/api";

export default function useBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await get("/api/brands");
        if (mounted) setBrands(data);
      } catch (err) {
        if (mounted) setError(err.response?.data?.error || err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { brands, loading, error };
}
