import MessageBubble from "./MessageBubble";

export default function ConversationThread({ messages = [], highlightedQuotes = [] }) {
  return (
    <div className="space-y-3 rounded-lg border bg-white p-4">
      {messages.length === 0 && (
        <p className="py-8 text-center text-sm text-slate-400">No messages to display</p>
      )}
      {messages.map((message) => {
        const content = message.content || message.text || "";
        const highlighted = highlightedQuotes.some((q) => content.includes(q));
        const isUser = (message.role || message.sender) === "user";
        return (
          <div key={message._id || `${message.sequence}-${content.slice(0, 10)}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <MessageBubble message={message} highlighted={highlighted} />
          </div>
        );
      })}
    </div>
  );
}
