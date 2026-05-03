"use client";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  messageContent?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  messageContent,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1A2332] rounded-2xl max-w-md w-full shadow-2xl border border-gray-700/50">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-2">Delete Message</h3>
          <p className="text-gray-300 mb-4">
            Are you sure you want to delete this message?
          </p>
          {messageContent && (
            <div className="mb-4 p-3 bg-[#222E3C] rounded-lg">
              <p className="text-sm text-gray-400 line-clamp-2">
                "{messageContent}"
              </p>
            </div>
          )}
          <p className="text-sm text-red-400 mb-6">
            This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#222E3C] hover:bg-[#2A3847] text-gray-200 rounded-lg transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}