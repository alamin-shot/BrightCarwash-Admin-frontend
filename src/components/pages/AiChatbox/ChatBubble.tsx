type Props = {
  sender: "bot" | "user";
  text: string;
  time?: string;
};

export default function ChatBubble({ sender, text, time }: Props) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md rounded-3xl px-5 py-4 text-sm shadow-sm
        ${isUser ? "bg-[#0f2746] text-white" : "bg-white text-slate-900 border border-slate-200"}`}
      >
        <div>{text}</div>
        {time ? (
          <div className="mt-2 text-right text-xs text-slate-400">{time}</div>
        ) : null}
      </div>
    </div>
  );
}
