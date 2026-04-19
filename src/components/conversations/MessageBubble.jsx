export default function MessageBubble({ message, highlighted, issueContext }) {
  const isUser = (message.role || message.sender) === "user";
  
  // Customizing for light theme while matching requested UX layout
  const normalBubble = isUser 
    ? "bg-white border border-slate-300 text-slate-800 shadow-sm"
    : "bg-[#eef2ff] border border-indigo-100 text-indigo-950 shadow-sm";

  const bgStyle = highlighted
    ? "bg-red-50 border border-red-400 text-red-950 shadow-sm"
    : normalBubble;

  return (
    <div className={`flex w-full flex-col ${isUser ? "items-start" : "items-end"}`}>
      <div className={`mb-1 flex items-center gap-2 ${isUser ? "" : "flex-row-reverse"}`}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {isUser ? "Customer" : "Assistant"}
        </span>
      </div>

      <div className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-4 py-3 text-sm flex-none ${bgStyle}`}>
        <p className="whitespace-pre-wrap leading-relaxed">{message.content || message.text}</p>
      </div>

      {highlighted && (
        <div className={`mt-2 flex flex-col ${isUser ? "items-start" : "items-end"} max-w-[85%] sm:max-w-[75%]`}>
          <span className="inline-block rounded border border-red-400 bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
            {issueContext?.type || "FLAGGED"}
          </span>
          {issueContext?.description && (
            <span className={`mt-1 text-xs italic text-red-600 ${isUser ? "text-left" : "text-right"}`}>
              {issueContext.description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
