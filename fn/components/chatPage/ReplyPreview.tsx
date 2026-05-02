"use client";

import { Message } from "@/types";

interface ReplyPreviewProps {
  replyingTo: Message;
  onCancel: () => void;
}

export default function ReplyPreview({ replyingTo, onCancel }: ReplyPreviewProps) {
  return (
    <div className="px-3 sm:px-4 py-2 bg-[#1D2733] border-t border-gray-700/50 shrink-0">
      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-800/50 rounded-lg gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-blue-400 font-semibold mb-1">Replying to</p>
          <p className="text-xs sm:text-sm text-gray-300 truncate">{replyingTo.content}</p>
        </div>
        <button onClick={onCancel} className="shrink-0 p-1 hover:bg-gray-700 rounded-full transition-colors">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}