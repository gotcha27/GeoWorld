// Représente un pays et ses informations associées.

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    OneToOne,
} from "typeorm";
import { Continent } from "./Continent";
import { Question } from "./Question";
import { Money } from "./Money";
import { Capital } from "./Capital";
import { Flag } from "./Flag";
import { Territory } from "./Territory";

@Entity()
export class Country {
    @PrimaryGeneratedColumn()
    countryId: number;

    @Column()
    name_country: string;

    @Column({ length: 3, unique: true, nullable: true })
    iso_code: string;

    @Column({ length: 2, unique: true, nullable: true })
    iso_code_2: string;

    @ManyToOne(() => Continent, continent => continent.countries)
    continent: Continent;

    @OneToMany(() => Question, question => question.country)
    questions: Question[];

    @OneToOne(() => Capital, capital => capital.country)
    capital: Capital;

    @OneToOne(() => Money, money => money.country)
    money: Money;

    @OneToOne(() => Flag, flag => flag.country)
    flag: Flag;

    @OneToMany(() => Territory, territory => territory.country)
    territories: Territory[];
}