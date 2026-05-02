const emojis = [
  "😀","😂","😍","🥰","😎","😭","😡","👍","👎","🙏",
  "🔥","🎉","❤️","💔","👏","🤔","😴","😅","🤯","🥳"
];

function EmojiPicker({
  onEmojiSelect,
  onClose,
}: {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute bottom-12 left-0 w-64 bg-[#1D2733] border border-gray-700 rounded-xl shadow-xl p-3">
      <div className="grid grid-cols-5 gap-2">
        {emojis.map((e) => (
          <button
            key={e}
            onClick={() => onEmojiSelect(e)}
            className="text-xl hover:bg-gray-700 rounded-lg p-2"
          >
            {e}
          </button>
        ))}
      </div>

      <button
        onClick={onClose}
        className="w-full mt-2 text-xs text-gray-400 hover:text-gray-200"
      >
        close
      </button>
    </div>
  );
}

export default EmojiPicker;
