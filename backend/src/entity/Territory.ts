// Représente un territoire et le pays auquel il est éventuellement rattaché.

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { Country } from "./Country";
import { Capital } from "./Capital";
import { Money } from "./Money";
import { Flag } from "./Flag";

@Entity()
export class Territory {
    @PrimaryGeneratedColumn()
    territoryId: number;

    @Column()
    name_territory: string;

    @Column({ length: 2, unique: true })
    iso_code_2: string;

    @Column({ length: 3, nullable: true, unique: true })
    iso_code: string | null;

    @ManyToOne(() => Country, {
        nullable: true,
    })
    @JoinColumn({ name: "countryId" })
    country: Country | null;

    @OneToOne(() => Capital, capital => capital.territory)
    capital: Capital;

    @OneToOne(() => Money, money => money.territory)
    money: Money;

    @OneToOne(() => Flag, flag => flag.territory)
    flag: Flag;
}