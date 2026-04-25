import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Message } from "./Messages";


@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user1Id" })
    user1!: User;

    @Column()
    user1Id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user2Id" })
    user2!: User;

    @Column()
    user2Id!: number;

    @Column({ nullable: true })
    lastMessage!: string;

    @Column({ nullable: true })
    lastMessageAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Message, message => message.conversationId)
    messages!: Message[];
}