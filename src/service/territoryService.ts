// Gère les recherches de territoires dans la base de données.

import { AppDataSource } from "../data-source";
import { Territory } from "../entity/Territory";

export class TerritoryService {
    private territoryRepository = AppDataSource.getRepository(Territory);

    async oneByIsoCode2(isoCode2: string) {
        return await this.territoryRepository.findOne({
            where: {
                iso_code_2: isoCode2,
            },
            relations: {
                country: true,
                capital: true,
                money: true,
                flag: true,
            },
        });
    }
}