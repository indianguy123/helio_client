export default function MessageBubble({ message, highlighted }) {
  const isUser = (message.role || message.sender) === "user";
  const base = isUser
    ? "bg-blue-600 text-white"
    : "bg-slate-100 text-slate-900";
  const flagged =
    !isUser && highlighted
      ? "bg-amber-100 border-2 border-amber-400 ring-2 ring-amber-200"
      : "";

  return (
    <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${base} ${flagged}`}>
      <div className="mb-1 flex items-center gap-2">
        <span className={`text-[10px] font-semibold uppercase tracking-wide ${isUser ? "text-blue-200" : "text-slate-400"}`}>
          {isUser ? "User" : "Agent"}
        </span>
        {!isUser && highlighted && (
          <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            ⚠ FLAGGED
          </span>
        )}
      </div>
      <p className="whitespace-pre-wrap">{message.content || message.text}</p>
    </div>
  );
}
