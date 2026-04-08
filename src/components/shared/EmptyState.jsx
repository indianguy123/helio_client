export default function EmptyState({ title = "No data", description = "Nothing to show yet." }) {
  return (
    <div className="rounded-lg border border-dashed bg-white p-8 text-center text-slate-500">
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  );
}
