// // src/components/ChatPage.tsx
// import { useState, useEffect, useRef } from "react";

// import { SolarArrowDown, SolarUserRoundedBoldDuotone } from "../icons/Icons";
// import DoubleCheck from "./DoubleCheck";
// import MsgOptionsModal from "./Modal";
// import MsgOptions from "./MsgOptions";
// import {
//   connect,
//   disconnect,
//   joinChat,
//   onMessage,
//   sendMessage,
// } from "../lib/socketService";

// export default function ChatPage() {
//   const [username, setUsername] = useState(() => {
//     return localStorage.getItem("chat_username") || "";
//   });
//   const [nameInput, setNameInput] = useState("");
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<any>(() => {
//     const saved = localStorage.getItem("chat_messages");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [connected, setConnected] = useState(!!username);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   // const sessionId = useRef<string>(Date.now().toString());


//   // ذخیره پیام‌ها در localStorage
//   // useEffect(() => {
//   //   localStorage.setItem("chat_messages", JSON.stringify(messages));
//   // }, [messages]);

//   // اتصال و شروع چت بعد از وارد کردن نام
//   useEffect(() => {
//     if (!connected) return;

//     const name = username.trim() || "User" + Math.floor(Math.random() * 1000);

//     connect(() => {
//       joinChat(name);
//     });

//    const unsubscribe = onMessage((msg: any) => {
//     const formatted = {
//       id: Date.now().toString(),
//       text: msg.content,
//       sender: msg.sender === username ? "me" : "other",
//       senderName: msg.sender, // ← نام ارسال‌کننده
//       timestamp: new Date(),
//     };

//     setMessages((prev: any) => [...prev, formatted]);
//   });

//     return () => {
//       unsubscribe();
//       disconnect();
//     };
//   }, [connected, username]);

//   // اسکرول خودکار به آخر پیام‌ها
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleNameSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const name = nameInput.trim();
//     if (!name) return;

//     setUsername(name);
//     // localStorage.setItem("chat_username", name);
//     setConnected(true);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || !connected) return;

//     sendMessage(input);
//     setInput("");
//   };

//   // صفحه ورود نام
//   if (!connected) {
//     return (
//       <div className="w-full h-full bg-[#151E27] flex flex-col items-center justify-center p-6">
//         <h2 className="text-2xl text-slate-200 mb-6">ورود به چت</h2>
//         <form
//           onSubmit={handleNameSubmit}
//           className="flex gap-2 w-full max-w-xs"
//         >
//           <input
//             type="text"
//             value={nameInput}
//             onChange={(e) => setNameInput(e.target.value)}
//             placeholder="نام خود را وارد کنید..."
//             className="flex-1 rounded-full px-4 py-2 bg-[#222E3C] text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             autoFocus
//           />
//           <button
//             type="submit"
//             className="btn-primary px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
//           >
//             شروع
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full bg-[#151E27] flex flex-col rounded-b-2xl">
//       {/* هدر */}
//       <div className="flex justify-center items-center gap-2 shadow-md p-3 rounded-b-2xl bg-[#222E3C] text-slate-400">
//         <span className="mt-1">User</span>
//         <div className="w-10 h-10 rounded-full shadow-xs shadow-black flex justify-center items-center">
//           <SolarUserRoundedBoldDuotone />
//         </div>
//       </div>

//       {/* لیست پیام‌ها */}
//       <div className="flex-1 overflow-y-auto space-y-3 pt-2 px-2">
//         {messages.map((msg: any) => (
//           <div key={msg.id} onClick={() => setModalIsOpen(true)}>
//             <div
//               className={`max-w-[75%] px-4 py-2 rounded-2xl ${
//                 msg.sender === "System"
//                   ? "bg-yellow-900/30 text-yellow-200 text-center text-sm"
//                   : msg.sender === "me"
//                     ? "bg-[#456A94] shadow-md text-slate-100 rounded-br-none"
//                     : "bg-gray-800 text-slate-100 rounded-bl-none"
//               }`}
//             >
//               {msg.sender !== "System" && (
//                 <p
//                   className={`text-xs font-semibold mb-1 ${msg.sender === "me" ? "text-blue-200" : "text-gray-300"}`}
//                 >
//                   {msg.senderName}
//                 </p>
//               )}
//               <p>{msg.text}</p>
//               {msg.sender !== "System" && (
//                 <p className="text-[10px] mt-1 opacity-70 text-right flex items-center gap-2 text-gray-200">
//                   {msg.sender === "me" && <DoubleCheck />}
//                   {new Date(msg.timestamp).toLocaleTimeString("fa-IR")}
//                 </p>
//               )}
//             </div>
//           </div>
//         ))}

//         <div ref={messagesEndRef} />
//       </div>

//       <MsgOptionsModal
//         modalIsOpen={modalIsOpen}
//         setModalIsOpen={setModalIsOpen}
//       >
//         <MsgOptions />
//       </MsgOptionsModal>

//       {/* فوتر ورودی */}
//       <form
//         onSubmit={handleSubmit}
//         className="flex gap-1 p-2 bg-[#1D2733] h-14"
//       >
//         <button type="submit" className="btn-primary" disabled={!input.trim()}>
//           <div className="w-8.5 h-8.5 rounded-full flex justify-center items-center bg-blue-500 disabled:opacity-50">
//             <SolarArrowDown width={20} className="text-white mt-0.5 mr-0.5" />
//           </div>
//         </button>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="پیام ..."
//           className="focus:shadow-xs focus:shadow-black focus:border-gray-700 focus:border w-full rounded-full px-3 py-2 text-gray-200 text-sm"
//         />
//       </form>
//     </div>
//   );
// }
