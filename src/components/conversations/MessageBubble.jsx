export default function MessageBubble({ message, highlighted }) {
  const isUser = (message.role || message.sender) === "user";
  const base = isUser ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-slate-200 text-slate-900";
  const flagged = !isUser && highlighted ? "bg-amber-200 border border-amber-400" : "";
  return (
    <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${base} ${flagged}`}>
      {!isUser && highlighted && <span className="mb-1 inline-block rounded bg-amber-500 px-2 py-0.5 text-[10px] text-white">flagged</span>}
      <p>{message.content || message.text}</p>
    </div>
  );
}
