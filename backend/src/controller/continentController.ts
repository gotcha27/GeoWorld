import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "../utils/errorUtils";
import { continentService } from "../service/continentService";

export class continentController {
    private ContinentService = new continentService();

    // controller get all
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.ContinentService.all();
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller get one
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const continent = await this.ContinentService.one(
                parseInt(request.params.continentId as string),
            );

            if (!continent) {
                return {
                    status: 400,
                    message: "continent not found",
                };
            }

            return { continent };
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller post
    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const response = await this.ContinentService.create(request.body);
            return { response };
        } catch (error) {
            return getErrorMessage(error);
        }
    }
}
