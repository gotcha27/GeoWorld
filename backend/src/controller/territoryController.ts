// Gère les requêtes liées aux territoires.

import { Request, Response } from "express";
import { TerritoryService } from "../service/territoryService";

const territoryService = new TerritoryService();

export class TerritoryController {

    async oneByIsoCode2(req: Request, res: Response) {
        const isoCode2 = req.params.isoCode2 as string;

        const territory = await territoryService.oneByIsoCode2(isoCode2);

        if (!territory) {
            return res.status(400).json({
                message: "Territoire introuvable",
            });
        }

        return res.json(territory);
    }
}