import MessageBubble from "./MessageBubble";

export default function ConversationThread({ messages = [], highlightedQuotes = [], issueContext = null }) {
  return (
    <div className="rounded-lg border bg-white p-4 sm:p-6 shadow-sm">
      {messages.length === 0 && (
        <p className="py-8 text-center text-sm text-slate-400">No messages to display</p>
      )}
      
      {messages.length > 0 && (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute bottom-0 left-0 top-0 w-[2px] bg-emerald-500" />
          
          <div className="flex flex-col space-y-6 pl-5 sm:pl-8 py-2">
            {messages.map((message) => {
              const content = message.content || message.text || "";
              const highlighted = highlightedQuotes.some((q) => content.includes(q));
              return (
                <MessageBubble 
                  key={message._id || `${message.sequence}-${content.slice(0, 10)}`} 
                  message={message} 
                  highlighted={highlighted}
                  issueContext={issueContext}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
