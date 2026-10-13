
// Recherche les pays et territoires selon le nom, la capitale ou la monnaie.
import { AppDataSource } from "../data-source";
import { Country } from "../entity/Country";
import { Territory } from "../entity/Territory";

export type SearchType = "country" | "capital" | "money";

export class SearchService {
    async search(query: string, type: SearchType) {
        const term = `${query.trim()}%`;

        const countryQuery = AppDataSource.getRepository(Country)
            .createQueryBuilder("country")
            .leftJoinAndSelect("country.capital", "capital")
            .leftJoinAndSelect("country.money", "money");

        const territoryQuery = AppDataSource.getRepository(Territory)
            .createQueryBuilder("territory")
            .leftJoinAndSelect("territory.country", "country")
            .leftJoinAndSelect("territory.capital", "capital")
            .leftJoinAndSelect("territory.money", "money");

        if (type === "country") {
            countryQuery.where("country.name_country LIKE :term", { term });
            territoryQuery.where("territory.name_territory LIKE :term", { term });
        } else if (type === "capital") {
            countryQuery.where("capital.name_capital LIKE :term", { term });
            territoryQuery.where("capital.name_capital LIKE :term", { term });
        } else if (type === "money") {
            countryQuery.where("money.name_money LIKE :term", { term });
            territoryQuery.where("money.name_money LIKE :term", { term });
        } else {
            return { countries: [], territories: [] };
        }

        const [countries, territories] = await Promise.all([
            countryQuery.getMany(),
            territoryQuery.getMany(),
        ]);

        return { countries, territories };
    }
}

