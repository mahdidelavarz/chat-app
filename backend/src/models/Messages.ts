import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text" })
    content!: string;

    @Column({ default: false })
    isRead!: boolean;

    @Column({ nullable: true })
    readAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: "senderId" })
    sender!: User;

    @Column()
    senderId!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "receiverId" })
    receiver!: User;

    @Column()
    receiverId!: number;

    @Column({ nullable: true })
    conversationId!: number;
}