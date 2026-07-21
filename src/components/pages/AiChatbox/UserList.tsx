import { mockChatUsers } from "@/mocks/ai-chatbox.mock";

type Props = {
  selectedUser: string;
  onSelectUser: (userId: string) => void;
};

export default function UserList({ selectedUser, onSelectUser }: Props) {
  return (
    <div className="space-y-2">
      {mockChatUsers.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user.id)}
          className={`w-full rounded-2xl border p-4 text-left transition shadow-sm
            ${
              selectedUser === user.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-medium text-slate-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <span className="text-xs text-gray-400">{user.lastActive}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
