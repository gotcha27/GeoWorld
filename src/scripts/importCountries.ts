import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Country } from "../entity/Country";
import { countries } from "../data/countries"
console.log(countries.length);
async function importCountries() {
    await AppDataSource.initialize();

    const countryRepository = AppDataSource.getRepository(Country);

    let added = 0;
    let skipped = 0;

    for (const name of countries) {
        const existingCountry = await countryRepository.findOne({
            where: {
                name_country: name,
            },
        });

        if (existingCountry) {
            skipped++;
            continue;
        }

        const country = countryRepository.create({
            name_country: name,
        });

        await countryRepository.save(country);
        added++;
    }

    console.log(`Pays ajoutés : ${added}`);
    console.log(`Pays déjà présents : ${skipped}`);

    await AppDataSource.destroy();
}

importCountries()
    .catch((error) => {
        console.error("Erreur lors de l'import des pays :", error);
        process.exit(1);
    });