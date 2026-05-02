import { Message } from "@/types";

interface MsgOptionsProps {
  message?: Message | null;
  currentUserId?: number;
  onReply?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
}

function MsgOptions({
  message,
  currentUserId,
  onReply,
  onCopy,
  onDelete,
}: MsgOptionsProps) {
  const isMine = message?.senderId === currentUserId;

  const Item = ({
    label,
    onClick,
    danger,
    icon,
  }: {
    label: string;
    onClick?: () => void;
    danger?: boolean;
    icon: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition
      ${danger ? "text-red-400 hover:bg-red-500/10" : "text-gray-200 hover:bg-gray-700/50"}`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="space-y-1">
      <Item
        label="Reply"
        onClick={onReply}
        icon={<span>↩️</span>}
      />

      <Item
        label="Copy message"
        onClick={onCopy}
        icon={<span>📋</span>}
      />

      {isMine && (
        <Item
          label="Delete message"
          danger
          onClick={onDelete}
          icon={<span>🗑</span>}
        />
      )}
    </div>
  );
}

export default MsgOptions;
