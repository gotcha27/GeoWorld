
/* Représente une capitale officielle ou une ville principale. */
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Country } from "./Country";
import { Territory } from "./Territory";

@Entity()
export class Capital {
    @PrimaryGeneratedColumn()
    capitalId: number;

    @Column()
    name_capital: string;

    @Column({ type: "varchar", length: 20, default: "CAPITAL" })
    localityType: "CAPITAL" | "PRINCIPAL_CITY";

    @OneToOne(() => Country, country => country.capital, { nullable: true })
    @JoinColumn({ name: "countryId" })
    country: Country | null;

    @OneToOne(() => Territory, territory => territory.capital, { nullable: true })
    @JoinColumn({ name: "territoryId" })
    territory: Territory | null;
}
