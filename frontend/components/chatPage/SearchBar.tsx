"use client";

export default function SearchBar() {
  return (
    <div className="p-3 sm:p-4 border-b border-gray-700/50 shrink-0">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pl-9 sm:pl-10 bg-[#222E3C] text-gray-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/50"
        />
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}