"use client";

import { SolarUserRoundedBoldDuotone } from "@/components/icons/Icons";
import { User } from "@/types";

interface UserProfileHeaderProps {
  user: User;
  onLogout: () => void;
}

export default function UserProfileHeader({ user, onLogout }: UserProfileHeaderProps) {
  return (
    <div className="p-4 sm:p-5 border-b border-gray-700/50 bg-gradient-to-r from-[#1D2733] to-[#222E3C] shrink-0">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex justify-center items-center shadow-lg">
              <SolarUserRoundedBoldDuotone className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-[#1D2733]"></div>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-slate-100 truncate">
              {user?.fullName || user?.username}
            </h2>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-2 sm:px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-xs font-semibold border border-red-500/30 shrink-0"
        >
          Logout
        </button>
      </div>
    </div>
  );
}