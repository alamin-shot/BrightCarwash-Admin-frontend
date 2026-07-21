type Props = {
  sender: "bot" | "user";
  text: string;
  time?: string;
};

export default function ChatBubble({ sender, text, time }: Props) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div>
        {time ? (
          <div
            className={`mt-2  text-xs text-slate-400 mb-1 ${isUser ? "text-right" : "text-left"}`}
          >
            {time}
          </div>
        ) : null}
        <div
          className={`max-w-md  px-3 py-2.5 text-sm leading-[160%]
        ${isUser ? "bg-[#0f2746] text-white rounded-l-2xl rounded-tr-2xl" : "bg-white text-slate-900 border border-slate-200 rounded-r-2xl rounded-tl-2xl"}`}
        >
          <div>{text}</div>
        </div>
      </div>
    </div>
  );
}
