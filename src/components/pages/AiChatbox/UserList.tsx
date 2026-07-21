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
          className={`w-full rounded-2xl border p-3.5 text-left transition 
            ${
              selectedUser === user.id
                ? "border-2 border-blue-500"
                : "border-gray-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
        >
          <div className="flex justify-between gap-2">
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
