import { RefreshCw } from "lucide-react";
import { ChatSession, ChatUser } from "@/mocks/ai-chatbox.mock";

type Props = {
  user: ChatUser;
  selectedSession: string | null;
  onSelectSession: (sessionId: string) => void;
};

const statusColors: Record<string, string> = {
  Normal: "bg-green-100 text-green-700",
  "Need Inquiry": "bg-amber-100 text-amber-700",
  Urgent: "bg-red-100 text-red-700",
};

export default function ChatSessionList({
  user,
  selectedSession,
  onSelectSession,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h3 className="font-medium">Chat Sessions</h3>
          <p className="text-sm text-gray-500">Showing conversations for {user.name}</p>
        </div>

        <RefreshCw size={16} className="text-gray-500" />
      </div>

      <div className="space-y-3 p-3">
        {user.sessions.length ? (
          user.sessions.map((session: ChatSession) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition shadow-sm
              ${selectedSession === session.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-slate-400 hover:bg-slate-50"}`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="font-medium text-slate-900">{session.date}</div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[session.status]}`}>
                  {session.status}
                </span>
              </div>

              <p className="text-sm text-slate-600">{session.preview}</p>
            </button>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
            No sessions available for this user.
          </div>
        )}
      </div>
    </div>
  );
}
