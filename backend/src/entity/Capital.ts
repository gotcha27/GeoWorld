// Représente la capitale d'un pays ou d'un territoire.

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { Country } from "./Country";
import { Territory } from "./Territory";

@Entity()
export class Capital {
    @PrimaryGeneratedColumn()
    capitalId: number;

    @Column()
    name_capital: string;

    @OneToOne(() => Country, country => country.capital, {
        nullable: true,
    })
    @JoinColumn({ name: "countryId" })
    country: Country | null;

    @OneToOne(() => Territory, territory => territory.capital, {
        nullable: true,
    })
    @JoinColumn({ name: "territoryId" })
    territory: Territory | null;
}