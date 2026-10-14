// Gère les recherches de pays dans la base de données.

import { AppDataSource } from "../data-source";
import { Country } from "../entity/Country";
import { countryCreateInterface } from "../interface/countryInterface";

export class countryService {
    private countryRepository = AppDataSource.getRepository(Country);

    // service all
    async all() {
        try {
            return await this.countryRepository.find({
                relations: {
                    capital: true,
                    territories: true,
                    money: true,
                    flag: true,
                },
            });
        } catch (error) {
            console.log(error);
        }
    }

    // service one
    async one(countryId: number) {
        try {
            const country = await this.countryRepository.findOne({
                where: { countryId },
                relations: {
                    capital: true,
                    territories: true,
                    money: true,
                    flag: true,
                },
            });
            return country;
        } catch (error) {
            console.log(error);
        }
    }

    // service one by ISO code
    async oneByIsoCode(isoCode: string) {
        try {
            const country = await this.countryRepository.findOne({
                where: { iso_code: isoCode },
                relations: {
                    capital: true,
                    territories: true,
                    money: true,
                    flag: true,
                },
            });
            return country;
        } catch (error) {
            console.log(error);
        }
    }

    // service one by ISO 2 code
    async oneByIsoCode2(isoCode2: string) {
        try {
            const country = await this.countryRepository.findOne({
                where: { iso_code_2: isoCode2 },
                relations: {
                    capital: true,
                    territories: true,
                    money: true,
                    flag: true,
                },
            });
            return country;
        } catch (error) {
            console.log(error);
        }
    }

    // service post
    async create(body: countryCreateInterface) {
        try {
            const response = this.countryRepository.create(body);
            return await this.countryRepository.save(response);
        } catch (error) {
            console.log(error);
        }
    }
}