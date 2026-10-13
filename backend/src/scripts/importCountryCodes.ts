import "reflect-metadata";
import countries from "i18n-iso-countries";
// importation de tous les codes iso de pays
const fr = require("i18n-iso-countries/langs/fr.json");

import { AppDataSource } from "../data-source";
import { Country } from "../entity/Country";

const countryAliases: Record<string, string> = {
    "Brunei": "BN",
    "Congo": "CG",
    "Congo (République démocratique du)": "CD",
    "Côte d'Ivoire": "CI",
    "Eswatini": "SZ",
    "États-Unis": "US",
    "Liberia": "LR",
    "Nigeria": "NG",
    "Salvador": "SV",
    "Sao Tomé-et-Principe": "ST",
    "Tanzanie": "TZ",
    "Timor oriental": "TL",
    "Vatican": "VA",
    "Viêt Nam": "VN",
};

countries.registerLocale(fr);

async function importCountryCodes() {
    await AppDataSource.initialize();

    const repository = AppDataSource.getRepository(Country);

    const dbCountries = await repository.find({
        order: {
            countryId: "ASC",
        },
    });

    console.log(`Pays trouvés en base : ${dbCountries.length}`);

    let updated = 0;
    const errors: string[] = [];

    for (const country of dbCountries) {
        const iso2 =
            countries.getAlpha2Code(country.name_country, "fr") ??
            countryAliases[country.name_country];

        if (!iso2) {
            errors.push(country.name_country);
            continue;
        }

        const iso3 = countries.alpha2ToAlpha3(iso2);

        if (!iso3) {
            errors.push(country.name_country);
            continue;
        }

        country.iso_code_2 = iso2;
        country.iso_code = iso3;

        await repository.save(country);

        updated++;
    }

    console.log(`Pays mis à jour : ${updated}`);
    console.log(`Erreurs : ${errors.length}`);

    if (errors.length > 0) {
        console.log("\nPays en erreur :");

        for (const name of errors) {
            console.log(`- ${name}`);
        }
    }

    await AppDataSource.destroy();
}

importCountryCodes()
    .catch((error) => {
        console.error("Erreur lors de l'import des codes ISO :", error);
        process.exit(1);
    });