
import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "../utils/errorUtils";
import { countryService } from "../service/countryService";

export class countryController {

    private CountryService = new countryService();

    // controller get all

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.CountryService.all();
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller get one

    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const country = await this.CountryService.one(
                parseInt(request.params.countryId as string),
            );

            if (!country) {
                return {
                    status: 400,
                    message: "country not found",
                };
            }

            return { country };
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller get one by ISO code

    async oneByIsoCode(request: Request, response: Response, next: NextFunction) {
        try {
            const country = await this.CountryService.oneByIsoCode(
                request.params.isoCode as string,
            );

            if (!country) {
                return {
                    status: 400,
                    message: "country not found",
                };
            }

            return { country };
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    // controller get one by ISO 2 code

    async oneByIsoCode2(request: Request, response: Response, next: NextFunction) {
        try {
            const country = await this.CountryService.oneByIsoCode2(
                request.params.isoCode2 as string,
            );

            if (!country) {
                return {
                    status: 400,
                    message: "country not found",
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
            const response = await this.CountryService.create(request.body);

            return { response };
        } catch (error) {
            return getErrorMessage(error);
        }
    }
}

