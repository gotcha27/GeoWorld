// Importe les capitales des pays et territoires et les rattache à la bonne entrée.

import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Capital } from "../entity/Capital";
import { Country } from "../entity/Country";
import { Territory } from "../entity/Territory";
import { capitals } from "../data/capitals";

async function importCapitals() {
    await AppDataSource.initialize();

    const capitalRepository = AppDataSource.getRepository(Capital);
    const countryRepository = AppDataSource.getRepository(Country);
    const territoryRepository = AppDataSource.getRepository(Territory);

    let inserted = 0;
    let alreadyExists = 0;
    let notFound = 0;

    for (const capitalData of capitals) {
        const country = await countryRepository.findOne({
            where: {
                iso_code_2: capitalData.iso_code_2,
            },
        });

        if (country) {
            const existingCapital = await capitalRepository.findOne({
                where: {
                    country: {
                        countryId: country.countryId,
                    },
                },
            });

            if (existingCapital) {
                console.log(
                    `Déjà présente : ${capitalData.iso_code_2} - ${capitalData.name_capital}`
                );
                alreadyExists++;
                continue;
            }

            const capital = capitalRepository.create({
                name_capital: capitalData.name_capital,
                country: country,
                territory: null,
            });

            await capitalRepository.save(capital);

            console.log(
                `Pays : ${capitalData.iso_code_2} - ${country.name_country} → ${capitalData.name_capital}`
            );

            inserted++;
            continue;
        }

        const territory = await territoryRepository.findOne({
            where: {
                iso_code_2: capitalData.iso_code_2,
            },
        });

        if (territory) {
            const existingCapital = await capitalRepository.findOne({
                where: {
                    territory: {
                        territoryId: territory.territoryId,
                    },
                },
            });

            if (existingCapital) {
                console.log(
                    `Déjà présente : ${capitalData.iso_code_2} - ${capitalData.name_capital}`
                );
                alreadyExists++;
                continue;
            }

            const capital = capitalRepository.create({
                name_capital: capitalData.name_capital,
                country: null,
                territory: territory,
            });

            await capitalRepository.save(capital);

            console.log(
                `Territoire : ${capitalData.iso_code_2} - ${territory.name_territory} → ${capitalData.name_capital}`
            );

            inserted++;
            continue;
        }

        console.error(
            `Introuvable : ${capitalData.iso_code_2} - ${capitalData.name_capital}`
        );
        notFound++;
    }

    console.log("");
    console.log("===== IMPORT DES CAPITALES TERMINÉ =====");
    console.log(`Capitales ajoutées : ${inserted}`);
    console.log(`Déjà présentes    : ${alreadyExists}`);
    console.log(`Introuvables       : ${notFound}`);

    await AppDataSource.destroy();
}

importCapitals().catch((error) => {
    console.error("Erreur pendant l'import des capitales :", error);
    process.exit(1);
});