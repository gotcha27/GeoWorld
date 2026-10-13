import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "../utils/errorUtils";
import { capitalService } from "../service/capitalService";

export class capitalController {
    private CapitalService = new capitalService();

    // controller get all
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.CapitalService.all();
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller get one
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const capital = await this.CapitalService.one(
                parseInt(request.params.capitalId as string),
            );

            if (!capital) {
                return {
                    status: 400,
                    message: "capital not found",
                };
            }

            return { capital };
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller post
    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const response = await this.CapitalService.create(request.body);
            return { response };
        } catch (error) {
            return getErrorMessage(error);
        }
    }
}
