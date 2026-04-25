// import type React from "react";

// function Modal({
//   modalIsOpen,
//   setModalIsOpen,
//   children,
// }: {
//   modalIsOpen: boolean;
//   setModalIsOpen: (x: boolean) => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <>
//       <aside
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="modal-title"
//         className={`fixed inset-0 z-50 ${modalIsOpen ? "pointer-events-auto" : "pointer-events-none"}`}
//       >
//         {/* پس‌زمینه تاریک (کلیک‌پذیر برای بستن) */}
//         <div
//           className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${modalIsOpen ? "opacity-100" : "opacity-0"}`}
//           onClick={() => setModalIsOpen(false)}
//           aria-hidden="true"
//         />

//         {/* Bottom Sheet */}
//         <div
//           className={`fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-2xl shadow-lg transition-transform duration-200 ease-out
//       ${modalIsOpen ? "translate-y-0" : "translate-y-full"}`}
//         >
//           <header className="px-6 py-4 border-b border-gray-700">
//             <h2 id="modal-title" className="text-slate-100 font-semibold">
//               عملیات
//             </h2>
//           </header>

//           <nav className="p-2" aria-label="عملیات پیام">
//             {children}
//           </nav>
//         </div>
//       </aside>
//     </>
//   );
// }

// export default Modal;
