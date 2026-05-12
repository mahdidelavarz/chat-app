import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../models/User";


const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, fullName } = req.body;

        // Check if user exists
        const existingUser = await userRepository.findOne({
            where: [{ username }, { email }]
        });

        if (existingUser) {
            res.status(400).json({ error: "Username or email already exists" });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = userRepository.create({
            username,
            email,
            password: hashedPassword,
            fullName
        });

        await userRepository.save(user);

        // Generate token - Fixed version
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            { userId: user.id },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await userRepository.findOne({
            where: { username }
        });

        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        // Generate token - Fixed version
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            { userId: user.id },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userRepository.find({
            select: ["id", "username", "email", "fullName", "isActive"],
            order: { username: "ASC" }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};