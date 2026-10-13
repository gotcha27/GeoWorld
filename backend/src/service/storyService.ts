import { AppDataSource } from "../data-source";
import { Story } from "../entity/Story";
import { moneyCreateInterface } from "../interface/moneyInterface";
import { storyCreateInterface } from "../interface/storyInterface";


export class storyService {
    private storyRepository = AppDataSource.getRepository(Story);

    //service all
    async all() {
        try {
            return await this.storyRepository.find();
        } catch (error) {}
    }
    //service one
    async one(storyId: number) {
        try {
            const money = await this.storyRepository.findOne({
                where: { storyId },
            });
            return money;
        } catch (error) {
            // Gérer l'erreur ici
        }
    }
    //servicre post
    async create(body: storyCreateInterface) {
        try {
            const response = this.storyRepository.create(body);
            return await this.storyRepository.save(response);
        } catch (error) {}
    }}