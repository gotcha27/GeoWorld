import "reflect-metadata";
import countries from "i18n-iso-countries";
// script test pour checher la route et la pertinence des informations
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

async function checkCountryCodes() {
    await AppDataSource.initialize();

    const repository = AppDataSource.getRepository(Country);

    const dbCountries = await repository.find({
        order: {
            countryId: "ASC",
        },
    });

    console.log(`Pays trouvés en base : ${dbCountries.length}`);

    const unmatched: string[] = [];
    const matches = [];

    const usedIso2 = new Set<string>();
    const usedIso3 = new Set<string>();

    for (const country of dbCountries) {
        const iso2 =
            countries.getAlpha2Code(country.name_country, "fr") ??
            countryAliases[country.name_country];

        if (!iso2) {
            unmatched.push(country.name_country);
            continue;
        }

        const iso3 = countries.alpha2ToAlpha3(iso2);

        if (!iso3) {
            console.log(
                `ISO3 introuvable pour : ${country.name_country}`
            );
            continue;
        }

        if (usedIso2.has(iso2)) {
            console.log(
                `DOUBLON ISO2 : ${iso2} (${country.name_country})`
            );
        }

        if (usedIso3.has(iso3)) {
            console.log(
                `DOUBLON ISO3 : ${iso3} (${country.name_country})`
            );
        }

        usedIso2.add(iso2);
        usedIso3.add(iso3);

        matches.push({
            id: country.countryId,
            name: country.name_country,
            iso2,
            iso3,
        });
    }

    console.log(`Correspondances trouvées : ${matches.length}`);
    console.log(`Pays non trouvés : ${unmatched.length}`);

    if (unmatched.length > 0) {
        console.log("\nPays sans correspondance :");

        for (const name of unmatched) {
            console.log(`- ${name}`);
        }
    }

    if (matches.length > 0) {
        console.log("\nExemples de correspondances :");

        for (const country of matches.slice(0, 10)) {
            console.log(
                `${country.name} → ${country.iso2} → ${country.iso3}`
            );
        }
    }

    await AppDataSource.destroy();
}

checkCountryCodes()
    .catch((error) => {
        console.error("Erreur :", error);
        process.exit(1);
    });