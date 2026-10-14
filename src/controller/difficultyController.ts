import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "../utils/errorUtils";
import { difficultyService } from "../service/difficultyService";

export class difficultyController {
    private DifficultyService = new difficultyService();

    // controller get all
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.DifficultyService.all();
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller get one
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const difficulty = await this.DifficultyService.one(
                parseInt(request.params.difficultyId as string),
            );

            if (!difficulty) {
                return {
                    status: 400,
                    message: "difficulty not found",
                };
            }

            return { difficulty };
        } catch (error) {
            return getErrorMessage(error);
        }
    }
}
