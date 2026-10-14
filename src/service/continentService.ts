import { AppDataSource } from "../data-source";
import { Continent } from "../entity/Continent";
import { Country } from "../entity/Country";
import { continentCreateInterface } from "../interface/continentInterface";



export class continentService {
    private continentRepository = AppDataSource.getRepository(Continent);

    //service all
    async all() {
        try {
            return await this.continentRepository.find();
        } catch (error) {}
    }
    //service one
    async one(continentId: number) {
        try {
            const continent = await this.continentRepository.findOne({
                where: { continentId },
            });
            return continent;
        } catch (error) {
            // Gérer l'erreur ici
        }
    }
    //servicre post
    async create(body: continentCreateInterface) {
        try {
            const response = this.continentRepository.create(body);
            return await this.continentRepository.save(response);
        } catch (error) {}
    }}