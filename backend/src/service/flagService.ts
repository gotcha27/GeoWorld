import { AppDataSource } from "../data-source";
import { Flag } from "../entity/Flag";
import { flagCreateInterface } from "../interface/flagInterface";


export class flagService {
    private flagRepository = AppDataSource.getRepository(Flag);

    //service all
    async all() {
        try {
            return await this.flagRepository.find();
        } catch (error) {}
    }
    //service one
    async one(flagId: number) {
        try {
            const flag = await this.flagRepository.findOne({
                where: { flagId },
                relations: ['country']
            });
            return flag;
        } catch (error) {
            // Gérer l'erreur ici
        }
    }
    //servicre post
    async create(body: flagCreateInterface) {
        try {
            const response = this.flagRepository.create(body);
            return await this.flagRepository.save(response);
        } catch (error) {}
    }}