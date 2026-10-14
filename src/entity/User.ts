
/* Définit les utilisateurs de GeoWorld. */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from "typeorm";
import { Token } from "./Token";
import { Story } from "./Story";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    firstName: string;

    @Column({ unique: true })
    pseudoName: string;

    @Column({ unique: true })
    mail: string;

    @Column()
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => Token, token => token.user)
    token: Token;

    @OneToMany(() => Story, story => story.user)
    stories: Story[];
}