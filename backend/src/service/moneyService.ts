import { AppDataSource } from "../data-source";
import { Money } from "../entity/Money";
import { moneyCreateInterface } from "../interface/moneyInterface";


export class moneyService {
    private moneyRepository = AppDataSource.getRepository(Money);

    //service all
    async all() {
        try {
            return await this.moneyRepository.find();
        } catch (error) {}
    }
    //service one
    async one(moneyId: number) {
        try {
            const money = await this.moneyRepository.findOne({
                where: { moneyId },
                relations: ['country']
            });
            return money;
        } catch (error) {
            // Gérer l'erreur ici
        }
    }
    //servicre post
    async create(body: moneyCreateInterface) {
        try {
            const response = this.moneyRepository.create(body);
            return await this.moneyRepository.save(response);
        } catch (error) {}
    }}