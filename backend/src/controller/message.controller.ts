import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";

import { AuthRequest } from "../middleware/auth";
import { Message } from "../models/Messages";
import { User } from "../models/User";

const messageRepository = AppDataSource.getRepository(Message);
const userRepository = AppDataSource.getRepository(User);

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.userId;

        const messages = await messageRepository.find({
            where: [
                { senderId: currentUserId, receiverId: parseInt(userId as string , 10) },
                { senderId: parseInt(userId as string , 10), receiverId: currentUserId }
            ],
            order: { createdAt: "ASC" },
            relations: ["sender", "receiver"]
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { messageId } = req.params;

        await messageRepository.update(messageId, {
            isRead: true,
            readAt: new Date()
        });

        res.json({ message: "Message marked as read" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};