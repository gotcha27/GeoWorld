import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Story } from "./Story"
import { Continent } from "./Continent"
import { Difficulty } from "./Difficulty"
import { Country } from "./Country"

@Entity()
export class Question {

    @PrimaryGeneratedColumn()
    questionId: number

    @Column()
    text_question: string

    @Column()
    correct_answer: string

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Story, (story) => story.questions)
    story: Story;

    @ManyToOne(() => Continent, (continent) => continent.questions)
    @JoinColumn({ name: "continentId" })
    continent: Continent;

    @ManyToOne(() => Difficulty, (difficulty) => difficulty.questions)
    difficulty: Difficulty;

    @ManyToOne(() => Country, country => country.questions)
    country: Country;


}
