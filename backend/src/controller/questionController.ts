import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "../utils/errorUtils";
import { questionService } from "../service/questionService";

export class questionController {
    private QuestionService = new questionService();

    // controller get all
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.QuestionService.all();
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller get one
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const question = await this.QuestionService.one(
                parseInt(request.params.questionId as string),
            );

            if (!question) {
                return {
                    status: 400,
                    message: "question not found",
                };
            }

            return { question };
        } catch (error) {
            return getErrorMessage(error);
        }
    }
}
