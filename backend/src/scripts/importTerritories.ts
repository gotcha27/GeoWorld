// Importe les territoires dans la base de données et les rattache à leur pays parent quand il existe.

import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Territory } from "../entity/Territory";
import { Country } from "../entity/Country";
import { territories } from "../data/territories";

async function importTerritories() {
    await AppDataSource.initialize();

    const territoryRepository = AppDataSource.getRepository(Territory);
    const countryRepository = AppDataSource.getRepository(Country);

    let inserted = 0;
    let alreadyExists = 0;

    for (const territoryData of territories) {
        const existingTerritory = await territoryRepository.findOne({
            where: {
                iso_code_2: territoryData.iso_code_2,
            },
        });

        if (existingTerritory) {
            console.log(
                `Déjà présent : ${territoryData.iso_code_2} - ${territoryData.name_territory}`
            );
            alreadyExists++;
            continue;
        }

        let country = null;

        if (territoryData.parent_iso_code_2) {
            country = await countryRepository.findOne({
                where: {
                    iso_code_2: territoryData.parent_iso_code_2,
                },
            });

            if (!country) {
                console.error(
                    `Pays parent introuvable : ${territoryData.parent_iso_code_2} pour ${territoryData.name_territory}`
                );
                continue;
            }
        }

        const territory = territoryRepository.create({
            name_territory: territoryData.name_territory,
            iso_code_2: territoryData.iso_code_2,
            iso_code: null,
            country: country,
        });

        await territoryRepository.save(territory);

        if (country) {
            console.log(
                `Ajouté : ${territoryData.iso_code_2} - ${territoryData.name_territory} → ${country.name_country}`
            );
        } else {
            console.log(
                `Ajouté : ${territoryData.iso_code_2} - ${territoryData.name_territory} → aucun pays parent`
            );
        }

        inserted++;
    }

    console.log("");
    console.log("===== IMPORT TERMINÉ =====");
    console.log(`Territoires ajoutés : ${inserted}`);
    console.log(`Déjà présents      : ${alreadyExists}`);

    await AppDataSource.destroy();
}

importTerritories().catch((error) => {
    console.error("Erreur pendant l'import :", error);
    process.exit(1);
});