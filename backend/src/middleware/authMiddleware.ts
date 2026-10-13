
// Vérifie le JWT avant d'autoriser l'accès à une route protégée.
import { Request, Response, NextFunction } from "express";
import jwt = require("jsonwebtoken");

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        mail: string;
    };
}

export function authMiddleware(
    request: AuthRequest,
    response: Response,
    next: NextFunction
) {
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return response.status(401).json({
            message: "Authentification requise."
        });
    }

    const token = authorization.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return response.status(500).json({
            message: "La configuration du serveur est incomplète."
        });
    }

    try {
        const payload = jwt.verify(token, secret);

        if (
            typeof payload === "string" ||
            typeof payload.userId !== "number" ||
            typeof payload.mail !== "string"
        ) {
            return response.status(401).json({
                message: "Token invalide."
            });
        }

        request.user = {
            userId: payload.userId,
            mail: payload.mail
        };

        next();
    } catch {
        return response.status(401).json({
            message: "Token invalide ou expiré."
        });
    }
}