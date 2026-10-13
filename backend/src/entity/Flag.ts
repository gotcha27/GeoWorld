// Représente le drapeau d'un pays ou d'un territoire.

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Country } from "./Country";
import { Territory } from "./Territory";

@Entity()
export class Flag {
    @PrimaryGeneratedColumn()
    flagId: number;

    @Column()
    picture_flag: string;

    @OneToOne(() => Country, country => country.flag, {
        nullable: true,
    })
    @JoinColumn({ name: "countryId" })
    country: Country | null;

    @OneToOne(() => Territory, territory => territory.flag, {
        nullable: true,
    })
    @JoinColumn({ name: "territoryId" })
    territory: Territory | null;
}