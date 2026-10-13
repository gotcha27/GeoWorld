import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm"
import { User } from "./User";
import { Question } from "./Question";

@Entity()
export class Story {

    @PrimaryGeneratedColumn()
    storyId: number

    @Column()
    score: number

    @Column()
    date: Date

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.stories)
    user: User

    @OneToMany(() => Question, (question) => question.story)
    questions: Question[];

}
