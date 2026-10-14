import { AppDataSource } from "../data-source";
import { Capital } from "../entity/Capital";
import { capitalCreateInterface } from "../interface/capitalInterface";


export class capitalService {
    private capitalRepository = AppDataSource.getRepository(Capital);

    //service all
    async all() {
        try {
            return await this.capitalRepository.find();
        } catch (error) {}
    }
    //service one
    async one(capitalId: number) {
        try {
            const capital = await this.capitalRepository.findOne({
                where: { capitalId },
                relations: ['country']
            });
            return capital;
        } catch (error) {
            // Gérer l'erreur ici
        }
    }
    //servicre post
    async create(body: capitalCreateInterface) {
        try {
            const response = this.capitalRepository.create(body);
            return await this.capitalRepository.save(response);
        } catch (error) {}
    }}