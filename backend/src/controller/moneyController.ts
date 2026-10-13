import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "../utils/errorUtils";
import { moneyService } from "../service/moneyService";

export class moneyController {
    private MoneyService = new moneyService();

    // controller get all
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.MoneyService.all();
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller get one
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const money = await this.MoneyService.one(
                parseInt(request.params.moneyId as string),
            );

            if (!money) {
                return {
                    status: 400,
                    message: "money not found",
                };
            }

            return { money };
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller post
    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const response = await this.MoneyService.create(request.body);
            return { response };
        } catch (error) {
            return getErrorMessage(error);
        }
    }
}
