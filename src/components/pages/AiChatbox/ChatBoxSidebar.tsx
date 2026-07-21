import { Search } from "lucide-react";
import UserList from "./UserList";

export default function Sidebar({ selectedUser, onSelectUser }: any) {
  return (
    <div className="flex flex-col rounded-xl border border-[#DFE1E7] bg-white">
      <div className="p-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            placeholder="Search users..."
            className="h-10 w-full rounded-lg border border-[#DFE1E7] px-3 pr-9 text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <UserList selectedUser={selectedUser} onSelectUser={onSelectUser} />
      </div>
    </div>
  );
}
