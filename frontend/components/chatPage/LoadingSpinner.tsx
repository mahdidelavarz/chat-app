"use client";

export default function LoadingSpinner() {
  return (
    <div className="h-dvh flex items-center justify-center bg-linear-to-br from-[#0F1419] via-[#151E27] to-[#1A2332]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    </div>
  );
}