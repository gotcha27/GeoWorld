// Vérifie les données de capitales récupérées depuis REST Countries.

import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Country } from "../entity/Country";
import { Territory } from "../entity/Territory";

async function getCapitals() {
    await AppDataSource.initialize();

    const countryRepository = AppDataSource.getRepository(Country);
    const territoryRepository = AppDataSource.getRepository(Territory);

    const countries = await countryRepository.find();
    const territories = await territoryRepository.find();

    console.log(`Pays présents en BDD : ${countries.length}`);
    console.log(`Territoires présents en BDD : ${territories.length}`);
    console.log("");

    const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=cca2,capital"
    );

    console.log(`Réponse API : ${response.status} ${response.statusText}`);
    console.log("");

    const data = await response.json();

    console.log("===== DONNÉES REÇUES =====");
    console.log("");

    console.log(data);

    await AppDataSource.destroy();
}

getCapitals().catch((error) => {
    console.error("Erreur pendant la récupération :", error);
    process.exit(1);
});