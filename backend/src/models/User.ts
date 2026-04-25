import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";


import { Message } from "./Messages";
import { Conversation } from "./Conversation";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, length: 50 })
    username!: string;

    @Column({ unique: true, length: 100 })
    email!: string;

    @Column()
    password!: string;

    @Column({ nullable: true, length: 100 })
    fullName!: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ default: null, nullable: true })
    socketId!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Message, message => message.sender)
    sentMessages!: Message[];

    @OneToMany(() => Message, message => message.receiver)
    receivedMessages!: Message[];

    @OneToMany(() => Conversation, conversation => conversation.user1)
    conversations1!: Conversation[];

    @OneToMany(() => Conversation, conversation => conversation.user2)
    conversations2!: Conversation[];
}