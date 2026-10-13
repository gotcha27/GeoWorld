// Importe les drapeaux des pays et territoires et les rattache à la base.

import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Flag } from "../entity/Flag";
import { Country } from "../entity/Country";
import { Territory } from "../entity/Territory";

const FLAG_BASE_URL = "https://flagcdn.com";

async function flagExists(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, {
            method: "HEAD",
        });
        return response.ok;
    } catch {
        return false;
    }
}

async function importFlags() {
    await AppDataSource.initialize();

    const flagRepository = AppDataSource.getRepository(Flag);
    const countryRepository = AppDataSource.getRepository(Country);
    const territoryRepository = AppDataSource.getRepository(Territory);

    let inserted = 0;
    let alreadyExists = 0;
    let notFound = 0;

    const countries = await countryRepository.find();
    const territories = await territoryRepository.find();

    console.log(`Pays trouvés : ${countries.length}`);
    console.log(`Territoires trouvés : ${territories.length}`);
    console.log("");

    // Import des drapeaux des pays.
    for (const country of countries) {
        if (!country.iso_code_2) {
            console.error(
                `ISO2 manquant : ${country.name_country}`
            );
            notFound++;
            continue;
        }

        const existingFlag = await flagRepository.findOne({
            where: {
                country: {
                    countryId: country.countryId,
                },
            },
        });

        if (existingFlag) {
            console.log(
                `Déjà présent : ${country.name_country}`
            );
            alreadyExists++;
            continue;
        }

        const isoCode = country.iso_code_2.toLowerCase();
        const pictureFlag = `${FLAG_BASE_URL}/${isoCode}.svg`;

        const exists = await flagExists(pictureFlag);

        if (!exists) {
            console.error(
                `Drapeau introuvable : ${country.name_country} (${country.iso_code_2})`
            );
            notFound++;
            continue;
        }

        const flag = flagRepository.create({
            picture_flag: pictureFlag,
            country: country,
            territory: null,
        });

        await flagRepository.save(flag);

        console.log(
            `Ajouté : ${country.name_country} → ${pictureFlag}`
        );

        inserted++;
    }

    // Import des drapeaux des territoires.
    for (const territory of territories) {
        // Svalbard et Jan Mayen utilise le drapeau norvégien.
        const isoCode =
            territory.iso_code_2 === "SJ"
                ? "no"
                : territory.iso_code_2.toLowerCase();

        const existingFlag = await flagRepository.findOne({
            where: {
                territory: {
                    territoryId: territory.territoryId,
                },
            },
        });

        if (existingFlag) {
            console.log(
                `Déjà présent : ${territory.name_territory}`
            );
            alreadyExists++;
            continue;
        }

        const pictureFlag = `${FLAG_BASE_URL}/${isoCode}.svg`;

        const exists = await flagExists(pictureFlag);

        if (!exists) {
            console.error(
                `Drapeau introuvable : ${territory.name_territory} (${territory.iso_code_2})`
            );
            notFound++;
            continue;
        }

        const flag = flagRepository.create({
            picture_flag: pictureFlag,
            country: null,
            territory: territory,
        });

        await flagRepository.save(flag);

        console.log(
            `Ajouté : ${territory.name_territory} → ${pictureFlag}`
        );

        inserted++;
    }

    console.log("");
    console.log("===== IMPORT DES DRAPEAUX TERMINÉ =====");
    console.log(`Drapeaux ajoutés : ${inserted}`);
    console.log(`Déjà présents    : ${alreadyExists}`);
    console.log(`Introuvables     : ${notFound}`);

    await AppDataSource.destroy();
}

importFlags().catch((error) => {
    console.error("Erreur pendant l'import :", error);
    process.exit(1);
});