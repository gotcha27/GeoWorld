
// Définit les refresh tokens des utilisateurs.
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    tokenId: number;

    @Column({ type: "varchar", length: 255 })
    token_value: string;

    @Column({ unique: true })
    user_id: number;

    @Column({ type: "datetime" })
    expires_at: Date;

    @Column({ type: "datetime", nullable: true })
    revoked_at: Date | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => User, user => user.token, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;
}

