// "use client";

// import DoubleCheck from "@/components/DoubleCheck";
// import EmojiPicker from "@/components/EmogiPicker";
// import {
//   SolarArrowDown,
//   SolarUserRoundedBoldDuotone,
// } from "@/components/icons/Icons";
// import Modal from "@/components/Modal";
// import MsgOptions from "@/components/MsgOptions";

// import { useSocket } from "@/hooks/useSocket";
// import apiService from "@/services/api";
// import { Message, User } from "@/types";
// import React, { useState, useEffect, useRef, useCallback } from "react";

// export default function ChatPage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [replyingTo, setReplyingTo] = useState<Message | null>(null);
//   const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
//   const typingTimeoutRef = useRef<NodeJS.Timeout>(undefined);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Fix viewport height for mobile browsers
//   useEffect(() => {
//     const setVH = () => {
//       const vh = window.innerHeight * 0.01;
//       document.documentElement.style.setProperty("--vh", `${vh}px`);
//     };

//     setVH();
//     window.addEventListener("resize", setVH);
//     window.addEventListener("orientationchange", setVH);

//     return () => {
//       window.removeEventListener("resize", setVH);
//       window.removeEventListener("orientationchange", setVH);
//     };
//   }, []);

//   // Check authentication
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (!token || !storedUser) {
//       window.location.href = "/login";
//       return;
//     }

//     try {
//       const userData = JSON.parse(storedUser);
//       setUser(userData);
//     } catch (error) {
//       console.error("Error parsing user:", error);
//       window.location.href = "/login";
//     }

//     setLoading(false);
//   }, []);

//   const handleNewMessage = useCallback(
//     (message: Message) => {
//       if (selectedUser && message.senderId === selectedUser.id) {
//         setMessages((prev) => [...prev, message]);
//       } else if (message.senderId === user?.id) {
//         setMessages((prev) => [...prev, message]);
//       } else {
//         // Update unread count for other users
//         setUnreadCounts((prev) => ({
//           ...prev,
//           [message.senderId]: (prev[message.senderId] || 0) + 1,
//         }));
//       }
//     },
//     [selectedUser, user],
//   );

//   const handleTyping = useCallback(
//     (typingUserId: number, typing: boolean) => {
//       if (selectedUser && selectedUser.id === typingUserId) {
//         setIsTyping(typing);
//       }
//     },
//     [selectedUser],
//   );

//   const { onlineUsers, sendMessage, sendTyping } = useSocket(
//     user?.id,
//     selectedUser,
//     handleNewMessage,
//     handleTyping,
//   );

//   useEffect(() => {
//     if (user) {
//       fetchUsers();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (selectedUser) {
//       fetchMessages(selectedUser.id);
//       // Clear unread count when selecting user
//       setUnreadCounts((prev) => ({
//         ...prev,
//         [selectedUser.id]: 0,
//       }));
//     }
//   }, [selectedUser]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const fetchUsers = async () => {
//     try {
//       const fetchedUsers = await apiService.getUsers();
//       setUsers(fetchedUsers.filter((u) => u.id !== user?.id));
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const fetchMessages = async (userId: number) => {
//     setLoading(true);
//     try {
//       const fetchedMessages = await apiService.getMessages(userId);
//       setMessages(fetchedMessages);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !selectedUser || !user) return;

//     const messageContent = replyingTo
//       ? `[Reply to: ${replyingTo.content}]\n${newMessage}`
//       : newMessage;

//     sendMessage(user.id, selectedUser.id, messageContent);
//     setNewMessage("");
//     setReplyingTo(null);
//     setShowEmojiPicker(false);
//   };

//   const handleTypingStart = () => {
//     if (selectedUser) {
//       sendTyping(selectedUser.id, true);

//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current);
//       }

//       typingTimeoutRef.current = setTimeout(() => {
//         if (selectedUser) {
//           sendTyping(selectedUser.id, false);
//         }
//       }, 1000);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     apiService.disconnectSocket();
//     window.location.href = "/login";
//   };

//   const handleMessageClick = (message: Message) => {
//     setSelectedMessage(message);
//     setModalIsOpen(true);
//   };

//   const handleReply = () => {
//     if (selectedMessage) {
//       setReplyingTo(selectedMessage);
//       setModalIsOpen(false);
//       inputRef.current?.focus();
//     }
//   };

//   const handleCopy = () => {
//     if (selectedMessage) {
//       navigator.clipboard.writeText(selectedMessage.content);
//       setModalIsOpen(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (selectedMessage) {
//       try {
//         // Add your delete message API call here
//         // await apiService.deleteMessage(selectedMessage.id);
//         setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id));
//         setModalIsOpen(false);
//       } catch (error) {
//         console.error("Error deleting message:", error);
//       }
//     }
//   };

//   const handleEmojiSelect = (emoji: string) => {
//     setNewMessage((prev) => prev + emoji);
//     setShowEmojiPicker(false);
//     inputRef.current?.focus();
//   };

//   const cancelReply = () => {
//     setReplyingTo(null);
//   };

//   if (loading) {
//     return (
//       <div className="h-[100dvh] flex items-center justify-center bg-gradient-to-br from-[#0F1419] via-[#151E27] to-[#1A2332]">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-400">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="flex h-[100dvh] bg-gradient-to-br from-[#0F1419] via-[#151E27] to-[#1A2332] overflow-hidden">
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#222E3C] rounded-xl text-white shadow-lg hover:bg-[#2A3847] transition-all"
//       >
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M4 6h16M4 12h16M4 18h16"
//           />
//         </svg>
//       </button>

//       {/* Sidebar Overlay for Mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed lg:relative w-80 bg-[#1A2332]/95 backdrop-blur-xl border-r border-gray-700/50 flex flex-col
//           transform transition-transform duration-300 ease-in-out z-50 h-[100dvh]
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//         `}
//       >
//         {/* User Profile Header */}
//         <div className="p-4 sm:p-5 border-b border-gray-700/50 bg-gradient-to-r from-[#1D2733] to-[#222E3C] shrink-0">
//           <div className="flex justify-between items-center gap-2">
//             <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//               <div className="relative shrink-0">
//                 <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex justify-center items-center shadow-lg">
//                   <SolarUserRoundedBoldDuotone className="text-white w-5 h-5 sm:w-6 sm:h-6" />
//                 </div>
//                 <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-[#1D2733]"></div>
//               </div>
//               <div className="min-w-0">
//                 <h2 className="text-sm sm:text-base font-semibold text-slate-100 truncate">
//                   {user?.fullName || user?.username}
//                 </h2>
//                 <p className="text-xs text-gray-400 truncate">{user?.email}</p>
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="px-2 sm:px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-xs font-semibold border border-red-500/30 shrink-0"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="p-3 sm:p-4 border-b border-gray-700/50 shrink-0">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search users..."
//               className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pl-9 sm:pl-10 bg-[#222E3C] text-gray-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/50"
//             />
//             <svg
//               className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Users List */}
//         <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
//           {users.map((u) => (
//             <div
//               key={u.id}
//               onClick={() => {
//                 setSelectedUser(u);
//                 setSidebarOpen(false);
//               }}
//               className={`p-3 sm:p-4 cursor-pointer hover:bg-[#222E3C]/50 transition-all border-b border-gray-700/30 ${
//                 selectedUser?.id === u.id
//                   ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-l-4 border-l-blue-500"
//                   : ""
//               }`}
//             >
//               <div className="flex items-center gap-2 sm:gap-3">
//                 <div className="relative shrink-0">
//                   <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex justify-center items-center">
//                     <span className="text-white font-semibold text-sm">
//                       {(u.fullName || u.username).charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                   {onlineUsers.includes(u.id) && (
//                     <div className="absolute bottom-0 right-0">
//                       <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-[#1A2332]"></div>
//                       <div className="absolute inset-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-ping"></div>
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between gap-2">
//                     <p className="font-semibold text-slate-100 text-sm truncate">
//                       {u.fullName || u.username}
//                     </p>
//                     {unreadCounts[u.id] > 0 && (
//                       <span className="shrink-0 px-1.5 sm:px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
//                         {unreadCounts[u.id]}
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-xs text-gray-400 truncate">
//                     @{u.username}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Area */}
//       {selectedUser ? (
//         <div className="flex-1 flex flex-col w-full h-[100dvh]">
//           {/* Chat Header */}
//           <div className="bg-gradient-to-r from-[#1D2733] to-[#222E3C] p-3 sm:p-4 border-b border-gray-700/50 shadow-xl backdrop-blur-xl shrink-0">
//             <div className="flex items-center justify-between gap-2">
//               <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//                 <div className="relative shrink-0">
//                   <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex justify-center items-center">
//                     <span className="text-white font-semibold text-sm">
//                       {(selectedUser.fullName || selectedUser.username)
//                         .charAt(0)
//                         .toUpperCase()}
//                     </span>
//                   </div>
//                   {onlineUsers.includes(selectedUser.id) && (
//                     <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-[#222E3C]"></div>
//                   )}
//                 </div>
//                 <div className="min-w-0">
//                   <h2 className="text-sm sm:text-base font-semibold text-slate-100 truncate">
//                     {selectedUser.fullName || selectedUser.username}
//                   </h2>
//                   <p className="text-xs text-gray-400 truncate">
//                     {isTyping ? (
//                       <span className="text-blue-400 animate-pulse">
//                         Typing...
//                       </span>
//                     ) : onlineUsers.includes(selectedUser.id) ? (
//                       <span className="text-green-400">Online</span>
//                     ) : (
//                       <span>@{selectedUser.username}</span>
//                     )}
//                   </p>
//                 </div>
//               </div>
//               <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors shrink-0">
//                 <svg
//                   className="w-5 h-5 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
//             {messages.map((msg) => {
//               const isReply = msg.content.startsWith("[Reply to:");
//               const replyContent = isReply
//                 ? msg.content
//                     .split("\n")[0]
//                     .replace("[Reply to: ", "")
//                     .replace("]", "")
//                 : null;
//               const actualContent = isReply
//                 ? msg.content.split("\n").slice(1).join("\n")
//                 : msg.content;

//               return (
//                 <div
//                   key={msg.id}
//                   onClick={() => handleMessageClick(msg)}
//                   className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"} cursor-pointer group`}
//                 >
//                   <div
//                     className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-lg transition-all hover:shadow-xl ${
//                       msg.senderId === user?.id
//                         ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
//                         : "bg-gradient-to-br from-gray-700 to-gray-800 text-slate-100 rounded-bl-md"
//                     }`}
//                   >
//                     {msg.senderId !== user?.id && (
//                       <p className="text-xs font-semibold mb-1 text-blue-300">
//                         {selectedUser.fullName || selectedUser.username}
//                       </p>
//                     )}
//                     {isReply && (
//                       <div className="mb-2 p-2 bg-black/20 rounded-lg border-l-2 border-white/30">
//                         <p className="text-xs opacity-70 line-clamp-2">
//                           {replyContent}
//                         </p>
//                       </div>
//                     )}
//                     <p className="break-words text-sm leading-relaxed">
//                       {actualContent}
//                     </p>
//                     <div className="flex items-center justify-end gap-2 mt-1">
//                       <p className="text-[10px] opacity-70">
//                         {formatTime(msg.createdAt)}
//                       </p>
//                       {msg.senderId === user?.id && msg.isRead && (
//                         <DoubleCheck />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Reply Preview */}
//           {replyingTo && (
//             <div className="px-3 sm:px-4 py-2 bg-[#1D2733] border-t border-gray-700/50 shrink-0">
//               <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-800/50 rounded-lg gap-2">
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs text-blue-400 font-semibold mb-1">
//                     Replying to
//                   </p>
//                   <p className="text-xs sm:text-sm text-gray-300 truncate">
//                     {replyingTo.content}
//                   </p>
//                 </div>
//                 <button
//                   onClick={cancelReply}
//                   className="shrink-0 p-1 hover:bg-gray-700 rounded-full transition-colors"
//                 >
//                   <svg
//                     className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Message Input - Fixed Footer */}
//           <div className="bg-gradient-to-r from-[#1D2733] to-[#222E3C] border-t border-gray-700/50 p-2 sm:p-3 md:p-4 shrink-0 safe-area-bottom">
//             <form
//               onSubmit={handleSendMessage}
//               className="flex items-center gap-1.5 sm:gap-2"
//             >
//               {/* Emoji Picker Button */}
//               <div className="relative shrink-0">
//                 <button
//                   type="button"
//                   onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                   className="p-2 sm:p-2.5 bg-[#222E3C] hover:bg-gray-700 rounded-xl transition-all border border-gray-700/50"
//                 >
//                   <svg
//                     className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                 </button>
//                 {showEmojiPicker && (
//                   <EmojiPicker
//                     onEmojiSelect={handleEmojiSelect}
//                     onClose={() => setShowEmojiPicker(false)}
//                   />
//                 )}
//               </div>

//               {/* Input Field */}
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyUp={handleTypingStart}
//                 placeholder="Type a message..."
//                 className="flex-1 rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-[#222E3C] text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/50 transition-all min-w-0"
//               />

//               {/* Attachment Button */}
//               <button
//                 type="button"
//                 className="shrink-0 p-2 sm:p-2.5 bg-[#222E3C] hover:bg-gray-700 rounded-xl transition-all border border-gray-700/50"
//               >
//                 <svg
//                   className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//                   />
//                 </svg>
//               </button>

//               {/* Send Button */}
//               <button
//                 type="submit"
//                 disabled={!newMessage.trim()}
//                 className="shrink-0 p-2 sm:p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//               >
//                 <SolarArrowDown
//                   width={20}
//                   height={20}
//                   className="text-white rotate-180 sm:w-6 sm:h-6"
//                 />
//               </button>
//             </form>
//           </div>

//           {/* Message Options Modal */}
//           <Modal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen}>
//             <MsgOptions
//               onReply={handleReply}
//               onCopy={handleCopy}
//               onDelete={handleDelete}
//               message={selectedMessage}
//               currentUserId={user?.id}
//             />
//           </Modal>
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center p-4">
//           <div className="text-center">
//             <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
//               <svg
//                 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">
//               Select a conversation
//             </h3>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "@/hooks/useSocket";
import apiService from "@/services/api";
import { Message, User } from "@/types";
import LoadingSpinner from "@/components/chatPage/LoadingSpinner";
import MobileMenuButton from "@/components/chatPage/MobileMenuBtn";
import SidebarOverlay from "@/components/chatPage/SidebarOverlay";
import Sidebar from "@/components/chatPage/Sidebar";
import ChatArea from "@/components/chatPage/ChatArea";
import EmptyChatState from "@/components/chatPage/EmptyChatState";


export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  // Fix viewport height for mobile browsers
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user:", error);
      window.location.href = "/login";
    }

    setLoading(false);
  }, []);

  const handleNewMessage = useCallback(
    (message: Message) => {
      if (selectedUser && message.senderId === selectedUser.id) {
        setMessages((prev) => [...prev, message]);
      } else if (message.senderId === user?.id) {
        setMessages((prev) => [...prev, message]);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1,
        }));
      }
    },
    [selectedUser, user],
  );

  const handleTyping = useCallback(
    (typingUserId: number, typing: boolean) => {
      if (selectedUser && selectedUser.id === typingUserId) {
        setIsTyping(typing);
      }
    },
    [selectedUser],
  );

  const { onlineUsers, sendMessage, sendTyping } = useSocket(
    user?.id,
    selectedUser,
    handleNewMessage,
    handleTyping,
  );

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      setUnreadCounts((prev) => ({
        ...prev,
        [selectedUser.id]: 0,
      }));
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await apiService.getUsers();
      setUsers(fetchedUsers.filter((u) => u.id !== user?.id));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMessages = async (userId: number) => {
    setLoading(true);
    try {
      const fetchedMessages = await apiService.getMessages(userId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = useCallback((messageContent: string) => {
    if (!selectedUser || !user) return;

    const content = replyingTo
      ? `[Reply to: ${replyingTo.content}]\n${messageContent}`
      : messageContent;

    sendMessage(user.id, selectedUser.id, content);
    setReplyingTo(null);
  }, [selectedUser, user, replyingTo, sendMessage]);

  const handleTypingStart = useCallback(() => {
    if (selectedUser) {
      sendTyping(selectedUser.id, true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (selectedUser) {
          sendTyping(selectedUser.id, false);
        }
      }, 1000);
    }
  }, [selectedUser, sendTyping]);

  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    apiService.disconnectSocket();
    window.location.href = "/login";
  }, []);

  const handleMessageClick = useCallback((message: Message) => {
    setSelectedMessage(message);
    setModalIsOpen(true);
  }, []);

  const handleReply = useCallback(() => {
    if (selectedMessage) {
      setReplyingTo(selectedMessage);
      setModalIsOpen(false);
    }
  }, [selectedMessage]);

  const handleCopy = useCallback(() => {
    if (selectedMessage) {
      navigator.clipboard.writeText(selectedMessage.content);
      setModalIsOpen(false);
    }
  }, [selectedMessage]);

  const handleDelete = useCallback(async () => {
    if (selectedMessage) {
      try {
        setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id));
        setModalIsOpen(false);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  }, [selectedMessage]);

  const closeModal = useCallback(() => setModalIsOpen(false), []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-[100dvh] bg-gradient-to-br from-[#0F1419] via-[#151E27] to-[#1A2332] overflow-hidden">
      <MobileMenuButton onClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {sidebarOpen && <SidebarOverlay onClick={() => setSidebarOpen(false)} />}
      
      <Sidebar
        isOpen={sidebarOpen}
        user={user}
        users={users}
        selectedUser={selectedUser || undefined}
        onlineUsers={onlineUsers}
        unreadCounts={unreadCounts}
        onLogout={handleLogout}
        onSelectUser={setSelectedUser}
        onClose={() => setSidebarOpen(false)}
      />

      {selectedUser ? (
        <ChatArea
          selectedUser={selectedUser}
          currentUser={user}
          messages={messages}
          isTyping={isTyping}
          isOnline={onlineUsers.includes(selectedUser.id)}
          replyingTo={replyingTo}
          selectedMessage={selectedMessage}
          modalIsOpen={modalIsOpen}
          onSendMessage={handleSendMessage}
          onTypingStart={handleTypingStart}
          onCancelReply={() => setReplyingTo(null)}
          onMessageClick={handleMessageClick}
          onCloseModal={closeModal}
          onReply={handleReply}
          onCopy={handleCopy}
          onDelete={handleDelete}
          formatTime={formatTime}
        />
      ) : (
        <EmptyChatState />
      )}
    </div>
  );
}