import MessageBubble from "./MessageBubble";

export default function ConversationThread({ messages = [], highlightedQuotes = [] }) {
  return (
    <div className="space-y-3 rounded-lg border bg-white p-4">
      {messages.map((message) => {
        const content = message.content || message.text || "";
        const highlighted = highlightedQuotes.some((q) => content.includes(q));
        return (
          <div key={message._id || `${message.sequence}-${content.slice(0, 10)}`} className="flex">
            <MessageBubble message={message} highlighted={highlighted} />
          </div>
        );
      })}
    </div>
  );
}
