import { ArrowLeft, Mail } from "lucide-react";
import ChatBubble from "./ChatBubble";
import { ChatSession, ChatUser } from "@/mocks/ai-chatbox.mock";
import ArrowLeftIcon from "../../../../public/icons/custom/ArrowLeftIcon";
import MailIcon from "../../../../public/icons/custom/MailIcon";

type Props = {
  user: ChatUser;
  session: ChatSession;
  onCloseSession: () => void;
};

export default function ChatWindow({ user, session, onCloseSession }: Props) {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-[#DFE1E7] bg-white">
      <div className="flex items-center justify-between border-b border-[#DFE1E7] p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCloseSession}
            className="rounded-full bg-gray-100 p-1.5 transition hover:bg-gray-200"
          >
            <ArrowLeftIcon />
          </button>

          <div>
            <h3 className="font-medium text-slate-900">{user.name}</h3>
          </div>
        </div>

        <button className="rounded-md bg-sky-500 p-1.5 text-white shadow-sm transition hover:bg-sky-600">
          <MailIcon />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
        <div>
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
