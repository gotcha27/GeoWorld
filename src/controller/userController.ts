// Gère les requêtes HTTP liées aux utilisateurs et à l'authentification.
import { NextFunction, Request, Response } from "express";
import { userService } from "../service/userService";
import { AuthRequest } from "../middleware/authMiddleware";
import bcrypt = require("bcrypt");
import jwt = require("jsonwebtoken");
import { createHash, randomBytes } from "crypto";

const REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;
const REFRESH_COOKIE = "refreshToken";

export class userController {
    private UserService = new userService();

    private getRefreshToken(request: Request): string | null {
        const cookies = request.headers.cookie;
        if (!cookies) return null;

        const cookie = cookies
            .split(";")
            .map((value) => value.trim())
            .find((value) => value.startsWith(`${REFRESH_COOKIE}=`));

        if (!cookie) return null;

        try {
            return decodeURIComponent(
                cookie.substring(REFRESH_COOKIE.length + 1),
            );
        } catch {
            return null;
        }
    }

    private hashRefreshToken(token: string): string {
        return createHash("sha256").update(token).digest("hex");
    }

    private createAccessToken(user: { id: number; mail: string }): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET manquant.");

        return jwt.sign({ userId: user.id, mail: user.mail }, secret, {
            expiresIn: "15m",
        });
    }

    private getRefreshCookieOptions() {
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
            path: "/",
            maxAge: REFRESH_TOKEN_DURATION,
        };
    }

    private setRefreshCookie(response: Response, token: string) {
        response.cookie(REFRESH_COOKIE, token, this.getRefreshCookieOptions());
    }

    private clearRefreshCookie(response: Response) {
        response.clearCookie(REFRESH_COOKIE, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });
    }

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return response.status(200).json(await this.UserService.all());
        } catch (error) {
            return response.status(500).json({
                message: "Impossible de récupérer les utilisateurs.",
            });
        }
    }

    async one(request: AuthRequest, response: Response, next: NextFunction) {
        try {
            const id = Number(request.params.userId);

            if (!Number.isInteger(id) || id <= 0) {
                return response
                    .status(400)
                    .json({ message: "Identifiant invalide." });
            }

            if (request.user?.userId !== id) {
                return response.status(403).json({
                    message:
                        "Vous ne pouvez consulter que votre propre compte.",
                });
            }

            const user = await this.UserService.one(id);

            if (!user) {
                return response
                    .status(404)
                    .json({ message: "Utilisateur introuvable." });
            }

            return response.status(200).json({ user });
        } catch (error) {
            return response.status(500).json({
                message: "Impossible de récupérer cet utilisateur.",
            });
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const createUser = await this.UserService.create(request.body);

            return response.status(201).json({
                message: "Compte créé avec succès.",
                user: createUser,
            });
        } catch (error) {
            const statusCode = (error as any)?.statusCode ?? 500;
            const message =
                statusCode < 500 && error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la création du compte.";

            return response.status(statusCode).json({ message });
        }
    }

    async login(request: Request, response: Response, next: NextFunction) {
        try {
            const { mail, password } = request.body ?? {};

            if (
                typeof mail !== "string" ||
                typeof password !== "string" ||
                !mail.trim() ||
                !password
            ) {
                return response.status(400).json({
                    message: "E-mail et mot de passe obligatoires.",
                });
            }

            const user = await this.UserService.findByMail(mail);

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return response.status(401).json({
                    message: "E-mail ou mot de passe incorrect.",
                });
            }

            const accessToken = this.createAccessToken(user);
            const refreshToken = randomBytes(64).toString("hex");
            const tokenHash = this.hashRefreshToken(refreshToken);
            const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DURATION);

            await this.UserService.saveRefreshToken(
                user.id,
                tokenHash,
                expiresAt,
            );
            this.setRefreshCookie(response, refreshToken);

            return response.status(200).json({
                message: "Connexion réussie.",
                accessToken,
                user: {
                    id: user.id,
                    name: user.name,
                    firstName: user.firstName,
                    pseudoName: user.pseudoName,
                    mail: user.mail,
                },
            });
        } catch (error) {
            return response.status(500).json({
                message: "Une erreur est survenue lors de la connexion.",
            });
        }
    }

    async refresh(request: Request, response: Response, next: NextFunction) {
        try {
            const refreshToken = this.getRefreshToken(request);

            if (!refreshToken) {
                this.clearRefreshCookie(response);
                return response
                    .status(401)
                    .json({ message: "Refresh token manquant." });
            }

            const tokenHash = this.hashRefreshToken(refreshToken);
            const storedToken =
                await this.UserService.findRefreshToken(tokenHash);

            if (
                !storedToken ||
                storedToken.revoked_at ||
                new Date(storedToken.expires_at).getTime() <= Date.now() ||
                !storedToken.user
            ) {
                this.clearRefreshCookie(response);
                return response.status(401).json({
                    message: "Refresh token invalide ou expiré.",
                });
            }

            const user = storedToken.user;
            const newAccessToken = this.createAccessToken(user);
            const newRefreshToken = randomBytes(64).toString("hex");
            const newTokenHash = this.hashRefreshToken(newRefreshToken);
            const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_DURATION);

            await this.UserService.saveRefreshToken(
                user.id,
                newTokenHash,
                newExpiresAt,
            );
            this.setRefreshCookie(response, newRefreshToken);

            return response.status(200).json({
                message: "Session renouvelée.",
                accessToken: newAccessToken,
            });
        } catch (error) {
            return response.status(500).json({
                message: "Impossible de renouveler la session.",
            });
        }
    }

    async logout(request: Request, response: Response, next: NextFunction) {
        try {
            const refreshToken = this.getRefreshToken(request);

            if (refreshToken) {
                await this.UserService.revokeRefreshToken(
                    this.hashRefreshToken(refreshToken),
                );
            }

            this.clearRefreshCookie(response);

            return response
                .status(200)
                .json({ message: "Déconnexion réussie." });
        } catch (error) {
            return response.status(500).json({
                message: "Impossible de terminer la déconnexion.",
            });
        }
    }

    async updatePassword(
        request: AuthRequest,
        response: Response,
        next: NextFunction,
    ) {
        try {
            const id = Number(request.params.userId);
            const newPassword = request.body?.password;

            if (
                !Number.isInteger(id) ||
                id <= 0 ||
                typeof newPassword !== "string" ||
                newPassword.length < 8
            ) {
                return response.status(400).json({
                    message: "Identifiant ou mot de passe invalide.",
                });
            }

            if (request.user?.userId !== id) {
                return response.status(403).json({
                    message:
                        "Vous ne pouvez modifier que votre propre mot de passe.",
                });
            }

            const password = await bcrypt.hash(newPassword, 10);
            const result = await this.UserService.updatePassword(id, password);

            if (!result.affected) {
                return response
                    .status(404)
                    .json({ message: "Utilisateur introuvable." });
            }

            return response
                .status(200)
                .json({ message: "Mot de passe modifié." });
        } catch (error) {
            return response.status(500).json({
                message: "Impossible de modifier le mot de passe.",
            });
        }
    }

    async remove(request: AuthRequest, response: Response, next: NextFunction) {
        try {
            const id = Number(request.params.userId);

            if (!Number.isInteger(id) || id <= 0) {
                return response
                    .status(400)
                    .json({ message: "Identifiant invalide." });
            }

            if (request.user?.userId !== id) {
                return response.status(403).json({
                    message:
                        "Vous ne pouvez supprimer que votre propre compte.",
                });
            }

            const removed = await this.UserService.removeById(id);

            if (!removed) {
                return response
                    .status(404)
                    .json({ message: "Utilisateur introuvable." });
            }

            return response
                .status(200)
                .json({ message: "Utilisateur supprimé." });
        } catch (error) {
            return response.status(500).json({
                message: "Impossible de supprimer cet utilisateur.",
            });
        }
    }
}
