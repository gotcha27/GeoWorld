
/* Gère les utilisateurs et les refresh tokens de GeoWorld. */
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Token } from "../entity/Token";
import { userCreateInterface } from "../interface/userInterface";
import bcrypt = require("bcrypt");

export class userService {
    private userRepository = AppDataSource.getRepository(User);
    private tokenRepository = AppDataSource.getRepository(Token);

    private publicUser(user: User) {
        return {
            id: user.id,
            name: user.name,
            firstName: user.firstName,
            pseudoName: user.pseudoName,
            mail: user.mail,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
    }

    async all() {
        const users = await this.userRepository.find();
        return users.map(user => this.publicUser(user));
    }

    async one(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        return user ? this.publicUser(user) : null;
    }

    async findByMail(mail: string) {
        return this.userRepository.findOne({
            where: { mail: mail.trim().toLowerCase() }
        });
    }

    async create(body: userCreateInterface) {
        const { name, firstName, pseudoName, mail, password, confirmPassword } = body;

        if (![name, firstName, pseudoName, mail, password, confirmPassword].every(value => typeof value === "string" && value.trim())) {
            throw Object.assign(new Error("Tous les champs sont obligatoires."), { statusCode: 400 });
        }

        const normalizedPseudo = pseudoName.trim();

        if (normalizedPseudo.length < 3 || normalizedPseudo.length > 20) {
            throw Object.assign(new Error("Le pseudo doit contenir entre 3 et 20 caractères."), { statusCode: 400 });
        }

        if (!/^[a-zA-Z0-9_]+$/.test(normalizedPseudo)) {
            throw Object.assign(new Error("Le pseudo peut contenir uniquement des lettres, des chiffres et des underscores (_)."), { statusCode: 400 });
        }

        if (password.length < 12) {
            throw Object.assign(new Error("Le mot de passe doit contenir au moins 12 caractères."), { statusCode: 400 });
        }

        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
            throw Object.assign(new Error("Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial."), { statusCode: 400 });
        }

        const commonPasswords = [
            "password123!",
            "password1234!",
            "qwerty123456!",
            "azerty123456!",
            "bonjour12345!",
            "motdepasse123!"
        ];

        if (commonPasswords.includes(password.toLowerCase())) {
            throw Object.assign(new Error("Ce mot de passe est trop courant. Choisissez-en un autre."), { statusCode: 400 });
        }

        if (password !== confirmPassword) {
            throw Object.assign(new Error("Les mots de passe ne correspondent pas."), { statusCode: 400 });
        }

        const normalizedMail = mail.trim().toLowerCase();

        const existingUser = await this.findByMail(normalizedMail);
        if (existingUser) {
            throw Object.assign(new Error("Cette adresse e-mail est déjà utilisée."), { statusCode: 409 });
        }

        const existingPseudo = await this.userRepository
            .createQueryBuilder("user")
            .where("LOWER(user.pseudoName) = LOWER(:pseudoName)", { pseudoName: normalizedPseudo })
            .getOne();

        if (existingPseudo) {
            throw Object.assign(new Error("Ce pseudo est déjà utilisé."), { statusCode: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.userRepository.create({
            name: name.trim(),
            firstName: firstName.trim(),
            pseudoName: normalizedPseudo,
            mail: normalizedMail,
            password: hashedPassword
        });

        try {
            return this.publicUser(await this.userRepository.save(newUser));
        } catch (error: any) {
            if (error?.code === "ER_DUP_ENTRY") {
                throw Object.assign(new Error("Cette adresse e-mail ou ce pseudo est déjà utilisé."), { statusCode: 409 });
            }
            throw error;
        }
    }

    async updatePassword(id: number, password: string) {
        return this.userRepository.update(id, { password });
    }

    async removeById(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) return false;

        await this.userRepository.remove(user);
        return true;
    }

    async saveRefreshToken(userId: number, tokenHash: string, expiresAt: Date) {
        let token = await this.tokenRepository.findOne({
            where: { user_id: userId }
        });

        if (token) {
            token.token_value = tokenHash;
            token.expires_at = expiresAt;
            token.revoked_at = null;
        } else {
            token = this.tokenRepository.create({
                user_id: userId,
                token_value: tokenHash,
                expires_at: expiresAt,
                revoked_at: null
            });
        }

        return this.tokenRepository.save(token);
    }

    async findRefreshToken(tokenHash: string) {
        return this.tokenRepository.findOne({
            where: { token_value: tokenHash },
            relations: { user: true }
        });
    }

    async revokeRefreshToken(tokenHash: string) {
        const token = await this.findRefreshToken(tokenHash);

        if (!token || token.revoked_at) {
            return false;
        }

        token.revoked_at = new Date();
        await this.tokenRepository.save(token);
        return true;
    }
}