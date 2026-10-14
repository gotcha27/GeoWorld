
// Vérifie les paramètres et renvoie les résultats de recherche.
import { Request, Response } from "express";
import { SearchService, SearchType } from "../service/searchService";

const searchService = new SearchService();
const allowedTypes: SearchType[] = ["country", "capital", "money"];

export class SearchController {
    async search(req: Request, res: Response) {
        const query = String(req.query.q ?? "").trim();
        const type = String(req.query.type ?? "");

        if (!query || !allowedTypes.includes(type as SearchType)) {
            return res.json({ countries: [], territories: [] });
        }

        try {
            const results = await searchService.search(query, type as SearchType);
            return res.json(results);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erreur pendant la recherche.",
            });
        }
    }
}

