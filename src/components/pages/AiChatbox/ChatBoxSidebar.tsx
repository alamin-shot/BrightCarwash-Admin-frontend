import { Search } from "lucide-react";
import UserList from "./UserList";

export default function Sidebar({ selectedUser, onSelectUser }: any) {
  return (
    <div className="flex flex-col rounded-xl border border-[#DFE1E7] bg-white ">
      <div className="flex-1 overflow-y-auto p-3 ">
        <div className="relative mb-2">
          <Search
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            placeholder="Search users..."
            className=" w-full rounded-2xl bg-[#f8fafb] border border-[#DFE1E7] px-3.75 py-3.5  text-sm outline-none"
          />
        </div>
        <UserList selectedUser={selectedUser} onSelectUser={onSelectUser} />
      </div>
    </div>
  );
}
