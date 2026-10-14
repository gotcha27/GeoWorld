import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "../utils/errorUtils";
import { flagService } from "../service/flagService";

export class flagController {
    private FlagService = new flagService();

    // controller get all
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.FlagService.all();
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller get one
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const flag = await this.FlagService.one(
                parseInt(request.params.flagId as string),
            );

            if (!flag) {
                return {
                    status: 400,
                    message: "flag not found",
                };
            }

            return { flag };
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller post
    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const response = await this.FlagService.create(request.body);
            return { response };
        } catch (error) {
            return getErrorMessage(error);
        }
    }
}
