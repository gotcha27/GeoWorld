import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Question } from "./Question";
import { Difficulty } from "./Difficulty";
import { Country } from "./Country";


@Entity()
export class Continent {

    @PrimaryGeneratedColumn()
    continentId: number

    @Column()
    name_continent: string

    @OneToMany(() => Question, (question) => question.continent)
    questions: Question[];

    @OneToMany(() => Difficulty, (difficulty) => difficulty.continent)
    difficulties: Difficulty[];

    @OneToMany(() => Country, country => country.continent)
    countries: Country[];

}