import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Layout from "../components/layout/Layout";
import api from "../services/api";

export default function UploadPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    try {
      const { data } = await api.post("/api/conversations/import/preview", form);
      setResult(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <Layout>
      <div className="space-y-4">
        <div {...getRootProps()} className="rounded-lg border-2 border-dashed bg-white p-10 text-center">
          <input {...getInputProps()} />
          <p>{isDragActive ? "Drop file here..." : "Drag & drop CSV/JSON, or click to select"}</p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {result && <pre className="overflow-auto rounded border bg-white p-4 text-xs">{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </Layout>
  );
}
