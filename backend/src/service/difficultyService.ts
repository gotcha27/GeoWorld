import { AppDataSource } from "../data-source";
import { Difficulty } from "../entity/Difficulty";
import { Question } from "../entity/Question";

export class difficultyService {
    private difficultyRepository = AppDataSource.getRepository(Difficulty);

    //service all
    async all() {
        try {
            return await this.difficultyRepository.find();
        } catch (error) {}
    }
    //service one
    async one(difficultyId: number) {
        try {
            const money = await this.difficultyRepository.findOne({
                where: { difficultyId },
          
            });
            return money;
        } catch (error) {
            // Gérer l'erreur ici
        }
    }
}