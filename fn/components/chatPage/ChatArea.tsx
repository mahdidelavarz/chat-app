"use client";

import { Message, User } from "@/types";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import ReplyPreview from "./ReplyPreview";
import MessageInput from "./MessageInput";
import Modal from "@/components/Modal";
import MsgOptions from "@/components/MsgOptions";

interface ChatAreaProps {
  selectedUser: User;
  currentUser: User;
  messages: Message[];
  isTyping: boolean;
  isOnline: boolean;
  replyingTo: Message | null;
  selectedMessage: Message | null;
  modalIsOpen: boolean;
  onSendMessage: (message: string) => void;
  onTypingStart: () => void;
  onCancelReply: () => void;
  onMessageClick: (message: Message) => void;
  onCloseModal: () => void;
  onReply: () => void;
  onCopy: () => void;
  onDelete: () => void;
  formatTime: (date: string) => string;
}

export default function ChatArea({
  selectedUser,
  currentUser,
  messages,
  isTyping,
  isOnline,
  replyingTo,
  selectedMessage,
  modalIsOpen,
  onSendMessage,
  onTypingStart,
  onCancelReply,
  onMessageClick,
  onCloseModal,
  onReply,
  onCopy,
  onDelete,
  formatTime,
}: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col w-full h-[100dvh]">
      <ChatHeader selectedUser={selectedUser} isTyping={isTyping} isOnline={isOnline} />
      
      <MessagesList
        messages={messages}
        currentUser={currentUser}
        selectedUser={selectedUser}
        onMessageClick={onMessageClick}
        formatTime={formatTime}
      />
      
      {replyingTo && <ReplyPreview replyingTo={replyingTo} onCancel={onCancelReply} />}
      
      <MessageInput onSendMessage={onSendMessage} onTypingStart={onTypingStart} />
      
      <Modal modalIsOpen={modalIsOpen} setModalIsOpen={onCloseModal}>
        <MsgOptions
          onReply={onReply}
          onCopy={onCopy}
          onDelete={onDelete}
          message={selectedMessage}
          currentUserId={currentUser?.id}
        />
      </Modal>
    </div>
  );
}