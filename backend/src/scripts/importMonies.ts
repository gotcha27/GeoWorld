// Importe les monnaies et les rattache aux pays ou aux territoires.

import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Money } from "../entity/Money";
import { Country } from "../entity/Country";
import { Territory } from "../entity/Territory";
import { monies } from "../data/monies";

async function importMonies() {
    await AppDataSource.initialize();

    const moneyRepository = AppDataSource.getRepository(Money);
    const countryRepository = AppDataSource.getRepository(Country);
    const territoryRepository = AppDataSource.getRepository(Territory);

    let inserted = 0;
    let alreadyExists = 0;
    let notFound = 0;

    for (const moneyData of monies) {
        const country = await countryRepository.findOne({
            where: {
                iso_code_2: moneyData.iso_code_2,
            },
        });

        if (country) {
            const existingMoney = await moneyRepository.findOne({
                where: {
                    country: {
                        countryId: country.countryId,
                    },
                },
            });

            if (existingMoney) {
                console.log(
                    `Déjà présente : ${country.name_country} → ${existingMoney.name_money}`
                );
                alreadyExists++;
                continue;
            }

            const money = moneyRepository.create({
                name_money: moneyData.name_money,
                country: country,
                territory: null,
            });

            await moneyRepository.save(money);

            console.log(
                `Ajoutée : ${country.name_country} → ${moneyData.name_money}`
            );

            inserted++;
            continue;
        }

        const territory = await territoryRepository.findOne({
            where: {
                iso_code_2: moneyData.iso_code_2,
            },
        });

        if (territory) {
            const existingMoney = await moneyRepository.findOne({
                where: {
                    territory: {
                        territoryId: territory.territoryId,
                    },
                },
            });

            if (existingMoney) {
                console.log(
                    `Déjà présente : ${territory.name_territory} → ${existingMoney.name_money}`
                );
                alreadyExists++;
                continue;
            }

            const money = moneyRepository.create({
                name_money: moneyData.name_money,
                country: null,
                territory: territory,
            });

            await moneyRepository.save(money);

            console.log(
                `Ajoutée : ${territory.name_territory} → ${moneyData.name_money}`
            );

            inserted++;
            continue;
        }

        console.error(
            `Pays ou territoire introuvable : ${moneyData.iso_code_2}`
        );
        notFound++;
    }

    console.log("");
    console.log("===== IMPORT DES MONNAIES TERMINÉ =====");
    console.log(`Monnaies ajoutées : ${inserted}`);
    console.log(`Déjà présentes    : ${alreadyExists}`);
    console.log(`Introuvables       : ${notFound}`);

    await AppDataSource.destroy();
}

importMonies().catch((error) => {
    console.error("Erreur pendant l'import :", error);
    process.exit(1);
});