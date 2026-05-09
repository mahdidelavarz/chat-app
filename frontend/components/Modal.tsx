import type React from "react";

function Modal({
  modalIsOpen,
  setModalIsOpen,
  children,
}: {
  modalIsOpen: boolean;
  setModalIsOpen: (x: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <aside
      className={`fixed inset-0 z-50 ${modalIsOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* overlay */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity ${
          modalIsOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setModalIsOpen(false)}
      />

      {/* sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#1D2733] rounded-t-3xl border-t border-gray-700 shadow-2xl transition-transform duration-300
        ${modalIsOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
        </div>

        <div className="px-4 pb-6">{children}</div>
      </div>
    </aside>
  );
}

export default Modal;
