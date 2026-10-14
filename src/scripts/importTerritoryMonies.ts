// Importe les monnaies des territoires et les rattache aux territoires.

import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Money } from "../entity/Money";
import { Territory } from "../entity/Territory";
import { territoryMonies } from "../data/territoryMonies";

async function importTerritoryMonies() {
    await AppDataSource.initialize();

    const moneyRepository = AppDataSource.getRepository(Money);
    const territoryRepository = AppDataSource.getRepository(Territory);

    let inserted = 0;
    let alreadyExists = 0;
    let notFound = 0;

    for (const moneyData of territoryMonies) {
        const territory = await territoryRepository.findOne({
            where: {
                iso_code_2: moneyData.iso_code_2,
            },
        });

        if (!territory) {
            console.error(
                `Territoire introuvable : ${moneyData.iso_code_2}`
            );
            notFound++;
            continue;
        }

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
    }

    console.log("");
    console.log("===== IMPORT DES MONNAIES DES TERRITOIRES TERMINÉ =====");
    console.log(`Monnaies ajoutées : ${inserted}`);
    console.log(`Déjà présentes    : ${alreadyExists}`);
    console.log(`Territoires introuvables : ${notFound}`);

    await AppDataSource.destroy();
}

importTerritoryMonies().catch((error) => {
    console.error("Erreur pendant l'import :", error);
    process.exit(1);
});