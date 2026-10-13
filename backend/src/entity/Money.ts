// Représente la monnaie d'un pays ou d'un territoire.

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Country } from "./Country";
import { Territory } from "./Territory";

@Entity()
export class Money {
    @PrimaryGeneratedColumn()
    moneyId: number;

    @Column()
    name_money: string;

    @OneToOne(() => Country, country => country.money, {
        nullable: true,
    })
    @JoinColumn({ name: "countryId" })
    country: Country | null;

    @OneToOne(() => Territory, territory => territory.money, {
        nullable: true,
    })
    @JoinColumn({ name: "territoryId" })
    territory: Territory | null;
}