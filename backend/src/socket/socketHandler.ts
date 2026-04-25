import { Server, Socket } from "socket.io";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { Message } from "../models/Messages";


const userRepository = AppDataSource.getRepository(User);
const messageRepository = AppDataSource.getRepository(Message);

interface OnlineUser {
    userId: number;
    socketId: string;
}

const onlineUsers = new Map<number, string>();

export const setupSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);

        socket.on("userOnline", async (userId: number) => {
            onlineUsers.set(userId, socket.id);

            // Update user socketId in database
            await userRepository.update(userId, { socketId: socket.id });

            // Broadcast online status
            io.emit("usersOnline", Array.from(onlineUsers.keys()));
        });

        socket.on("sendMessage", async (data: {
            senderId: number;
            receiverId: number;
            content: string;
        }) => {
            try {
                // Save message to database
                const message = messageRepository.create({
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    content: data.content
                });

                const savedMessage = await messageRepository.save(message);

                // Get sender info
                const sender = await userRepository.findOneBy({ id: data.senderId });

                const messageData = {
                    id: savedMessage.id,
                    content: savedMessage.content,
                    senderId: savedMessage.senderId,
                    receiverId: savedMessage.receiverId,
                    createdAt: savedMessage.createdAt,
                    sender: {
                        id: sender?.id,
                        username: sender?.username,
                        fullName: sender?.fullName
                    }
                };

                // Send to receiver if online
                const receiverSocketId = onlineUsers.get(data.receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newMessage", messageData);
                }

                // Confirm to sender
                socket.emit("messageSent", messageData);

            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("messageError", { error: "Failed to send message" });
            }
        });

        socket.on("typing", (data: { receiverId: number; isTyping: boolean }) => {
            const receiverSocketId = onlineUsers.get(data.receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("userTyping", {
                    userId: data.receiverId,
                    isTyping: data.isTyping
                });
            }
        });

        socket.on("disconnect", async () => {
            console.log("User disconnected:", socket.id);

            // Remove user from online users
            let disconnectedUserId: number | undefined;
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    onlineUsers.delete(userId);
                    break;
                }
            }

            if (disconnectedUserId) {
                await userRepository.update(disconnectedUserId, { socketId: "" });
                io.emit("usersOnline", Array.from(onlineUsers.keys()));
            }
        });
    });
};