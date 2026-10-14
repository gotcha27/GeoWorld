
// Gère les requêtes HTTP pour générer un quiz dynamique.
import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "../utils/errorUtils";
import { quizzService } from "../service/quizzService";

export class quizzController {
    private QuizzService = new quizzService();

    // Génère les questions selon la catégorie et la difficulté.
    async generate(request: Request, response: Response, next: NextFunction) {
        try {
            const category = request.query.category as string;
            const difficulty = request.query.difficulty as string;

            const validCategories = ["CAPITALS", "FLAGS", "CURRENCIES"];
            const validDifficulties = ["easy", "medium", "hard"];

            if (!validCategories.includes(category)) {
                return {
                    status: 400,
                    message: "Catégorie invalide.",
                };
            }

            if (!validDifficulties.includes(difficulty)) {
                return {
                    status: 400,
                    message: "Difficulté invalide.",
                };
            }

            const questions = await this.QuizzService.generate(
                category as "CAPITALS" | "FLAGS" | "CURRENCIES",
                difficulty as "easy" | "medium" | "hard"
            );

            return {
                category,
                difficulty,
                total: questions.length,
                questions,
            };
        } catch (error) {
            return getErrorMessage(error);
        }
    }
}
