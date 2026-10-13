import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm"
import { Question } from "./Question";
import { Continent } from "./Continent";

@Entity()
export class Difficulty {

    @PrimaryGeneratedColumn()
    difficultyId: number;

    @Column()
    easy: boolean;

    @Column()
    medium: boolean;

    @Column()
    hard: boolean;


    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Question, (question) => question.difficulty)
    questions: Question[];

    @ManyToOne(() => Continent, (continent) => continent.difficulties)
    continent: Continent;

}