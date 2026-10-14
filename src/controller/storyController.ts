import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "../utils/errorUtils";
import { storyService } from "../service/storyService";

export class storyController {
    private StoryService = new storyService();

    // controller get all
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.StoryService.all();
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller get one
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const country = await this.StoryService.one(
                parseInt(request.params.storyId as string),
            );

            if (!country) {
                return {
                    status: 400,
                    message: "story not found",
                };
            }

            return { country };
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller post
    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const response = await this.StoryService.create(request.body);
            return { response };
        } catch (error) {
            return getErrorMessage(error);
        }
    }
}
