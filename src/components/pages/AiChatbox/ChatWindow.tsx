import { ArrowLeft, Mail } from "lucide-react";
import ChatBubble from "./ChatBubble";
import { ChatSession, ChatUser } from "@/mocks/ai-chatbox.mock";

type Props = {
  user: ChatUser;
  session: ChatSession;
  onCloseSession: () => void;
};

export default function ChatWindow({ user, session, onCloseSession }: Props) {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCloseSession}
            className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h3 className="font-medium text-slate-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <button className="rounded-md bg-sky-500 px-3 py-2 text-white shadow-sm transition hover:bg-sky-600">
          <Mail size={18} />
        </button>
      </div>

      <div className="border-b px-6 py-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span>{session.date}</span>
          <span>•</span>
          <span>{session.label}</span>
        </div>
        <p className="mt-2 text-sm text-slate-700">{session.preview}</p>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="space-y-6">
          {session.messages.map((message, index) => (
            <ChatBubble
              key={index}
              sender={message.sender}
              text={message.text}
              time={message.time}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
