import { AppDataSource } from "../data-source";
import { Question } from "../entity/Question";

export class questionService {
    private questionRepository = AppDataSource.getRepository(Question);

    //service all
    async all() {
        try {
            return await this.questionRepository.find();
        } catch (error) {}
    }
    //service one
    async one(questionId: number) {
        try {
            const money = await this.questionRepository.findOne({
                where: { questionId },
                relations: ['continentId']
            });
            return money;
        } catch (error) {
            // Gérer l'erreur ici
        }
    }
}