
// Script pour afficher les entrées MapTiler avec un code ISO2 absent de notre BDD

import fs from "fs";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Country } from "../entity/Country";

const filePath = "/Users/vecchiarelli/Desktop/administrative-level-0.csv";

const ScriptDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3307,
    username: "fab",
    password: "Fabien29",
    database: "geoWorld_database",
    synchronize: false,
    logging: false,
    entities: ["./src/entity/*.ts"],
});

async function compareMapTilerWithDatabase() {
    try {
        const content = fs.readFileSync(filePath, "utf-8");
        const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");

        await ScriptDataSource.initialize();

        const countries = await ScriptDataSource
            .getRepository(Country)
            .find();

        const countryIso2 = new Set(
            countries
                .map(country => country.iso_code_2?.toUpperCase())
                .filter(Boolean)
        );

        const entries = lines.slice(1)
            .map(line => {
                const values = line.split(",");

                return {
                    gid: values[0],
                    iso_a2: values[1]?.replace(/"/g, ""),
                    code: values[2]?.replace(/"/g, ""),
                    name: values[3]?.replace(/"/g, ""),
                    continent: values[4]?.replace(/"/g, ""),
                };
            })
            .filter(entry =>
                entry.iso_a2 &&
                !countryIso2.has(entry.iso_a2.toUpperCase())
            );

        console.log("Entrées MapTiler avec ISO2 absentes de la BDD :");
        console.log("Nombre :", entries.length);
        console.log("");

        entries.forEach(entry => {
            console.log(
                `${entry.iso_a2} | ${entry.code} | ${entry.name} | ${entry.continent}`
            );
        });

        await ScriptDataSource.destroy();

    } catch (error) {
        console.error("Erreur :", error);
    }
}

compareMapTilerWithDatabase();

