// Initialise le serveur Express et enregistre les routes de l'API GeoWorld.
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

AppDataSource.initialize()
    .then(async () => {
        // Création de l'application Express.
        const app = express();

        // Autorise le frontend Vue à envoyer les cookies d'authentification.
        app.use(
            cors({
                origin: "http://localhost:5173",
                credentials: true,
            }),
        );
        app.use(express.json());

        // Enregistrement des routes définies dans Routes.
        Routes.forEach((route) => {
            const middlewares = (route as any).middlewares ?? [];

            (app as any)[route.method](
                route.route,
                ...middlewares,
                (req: Request, res: Response, next: NextFunction) => {
                    try {
                        const result = new (route.controller as any)()[
                            route.action
                        ](req, res, next);

                        if (result instanceof Promise) {
                            result
                                .then((result) => {
                                    if (
                                        result !== null &&
                                        result !== undefined &&
                                        !res.headersSent
                                    ) {
                                        res.send(result);
                                    }
                                })
                                .catch(next);
                        } else if (
                            result !== null &&
                            result !== undefined &&
                            !res.headersSent
                        ) {
                            res.json(result);
                        }
                    } catch (error) {
                        next(error);
                    }
                },
            );
        });

        // Gestion des erreurs non traitées par les routes.
        app.use(
            (error: any, req: Request, res: Response, next: NextFunction) => {
                console.error(error);

                if (res.headersSent) {
                    return next(error);
                }

                res.status(500).json({
                    message: "Une erreur interne est survenue.",
                });
            },
        );

        // Démarrage du serveur.
        app.listen(process.env.PORT, () => {
            console.log(
                `Express server has started on port ${process.env.PORT}. Open http://localhost:${process.env.PORT}/users to see results`,
            );
        });
    })
    .catch((error) => {
        console.error("Impossible de connecter la base de données :", error);
    });
