
/* Génère des questions de quiz GeoWorld avec des localités correctement identifiées. */
import { AppDataSource } from "../data-source";
import { Capital } from "../entity/Capital";
import { Flag } from "../entity/Flag";
import { Money } from "../entity/Money";

type QuizzCategory = "CAPITALS" | "FLAGS" | "CURRENCIES";
type QuizzDifficulty = "easy" | "medium" | "hard";
type Region = "AFRICA" | "ASIA" | "EUROPE" | "NORTH_AMERICA" | "SOUTH_AMERICA" | "OCEANIA" | "OTHER";
type LocalityType = "CAPITAL" | "PRINCIPAL_CITY";

interface QuizzQuestion {
    question: string;
    correctAnswer: string;
    choices: string[];
    imageUrl: string | null;
}

interface QuizzItem {
    countryName: string;
    countryCode: string;
    region: Region;
    answer: string;
    imageUrl: string | null;
    localityType?: LocalityType;
}

export class quizzService {
    private capitalRepository = AppDataSource.getRepository(Capital);
    private flagRepository = AppDataSource.getRepository(Flag);
    private moneyRepository = AppDataSource.getRepository(Money);

    private shuffle<T>(items: T[]): T[] {
        const shuffled = [...items];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    private normalize(name: string): string {
        return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }

    private isExcludedTerritory(name: string): boolean {
        const normalized = this.normalize(name);
        return [
            "territoire britannique de l'ocean indien",
            "british indian ocean territory",
            "british indian ocean",
            "iles heard-et-macdonald",
            "heard island and mcdonald islands",
            "heard and mcdonald islands",
        ].includes(normalized);
    }

    private getCountryName(item: {
        country?: { name_country: string } | null;
        territory?: { name_territory: string } | null;
    }): string | null {
        return item.country?.name_country || item.territory?.name_territory || null;
    }

    private getFlagAnswer(item: {
        country?: { name_country: string } | null;
        territory?: {
            name_territory: string;
            country?: { name_country: string } | null;
        } | null;
    }): string | null {
        return item.country?.name_country
            || item.territory?.country?.name_country
            || item.territory?.name_territory
            || null;
    }

    private getCountryCode(item: {
        country?: { iso_code_2?: string | null } | null;
        territory?: { iso_code_2?: string | null } | null;
    }): string {
        return item.country?.iso_code_2 || item.territory?.iso_code_2 || "";
    }

    private getRegion(code: string): Region {
        const regions: Record<Exclude<Region, "OTHER">, string[]> = {
            AFRICA: ["DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD", "KM", "CG", "CD", "CI", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG", "ZM", "ZW"],
            ASIA: ["AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "CY", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "KP", "OM", "PK", "PS", "PH", "QA", "SA", "SG", "KR", "LK", "SY", "TW", "TJ", "TH", "TL", "TR", "TM", "AE", "UZ", "VN", "YE"],
            EUROPE: ["AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "MD", "MC", "ME", "NL", "MK", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "VA", "XK", "SJ"],
            NORTH_AMERICA: ["AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GD", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US", "PR", "GL", "BM", "KY", "GP", "MQ", "AW", "CW", "SX", "BQ", "AI", "VG", "VI", "MS", "TC", "BL", "MF"],
            SOUTH_AMERICA: ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE", "GF", "FK"],
            OCEANIA: ["AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "WS", "SB", "TO", "TV", "VU", "NC", "PF", "GU", "AS", "MP", "CK", "NU", "TK"],
        };

        for (const [region, codes] of Object.entries(regions)) {
            if (codes.includes(code.toUpperCase())) return region as Region;
        }
        return "OTHER";
    }

    private getWrongAnswers(item: QuizzItem, items: QuizzItem[], difficulty: QuizzDifficulty): string[] {
        const available = [...new Set(items.map(other => other.answer))].filter(answer => answer !== item.answer);
        if (difficulty === "easy") return this.shuffle(available).slice(0, 3);

        let candidates = [...new Set(items
            .filter(other => other.region === item.region && other.answer !== item.answer)
            .map(other => other.answer))];

        if (difficulty === "hard") {
            const similarLength = candidates.filter(answer =>
                Math.abs(answer.length - item.answer.length) <= Math.max(3, Math.floor(item.answer.length * 0.35))
            );
            if (similarLength.length >= 3) candidates = similarLength;
        }

        if (candidates.length < 3) candidates = [...new Set([...candidates, ...available])];
        return this.shuffle(candidates.filter(answer => answer !== item.answer)).slice(0, 3);
    }

    async generate(category: QuizzCategory, difficulty: QuizzDifficulty): Promise<QuizzQuestion[]> {
        let items: QuizzItem[] = [];

        if (category === "CAPITALS") {
            const localities = await this.capitalRepository.find({ relations: ["country", "territory"] });

            items = localities.map(item => {
                // Si une localité est liée à un territoire, on utilise le territoire comme sujet.
                const subject = item.territory?.name_territory || item.country?.name_country || "";
                const countryCode = this.getCountryCode(item);

                return {
                    countryName: subject,
                    countryCode,
                    region: this.getRegion(countryCode),
                    answer: item.name_capital,
                    imageUrl: null,
                    localityType: item.localityType,
                };
            }).filter(item =>
                item.countryName
                && item.answer
                && !this.isExcludedTerritory(item.countryName)
            );
        } else if (category === "FLAGS") {
            const flags = await this.flagRepository.find({
                relations: { country: true, territory: { country: true } },
            });

            items = flags.map(item => {
                const countryName = this.getCountryName(item) || "";
                const countryCode = this.getCountryCode(item);

                return {
                    countryName,
                    countryCode,
                    region: this.getRegion(countryCode),
                    answer: this.getFlagAnswer(item) || "",
                    imageUrl: item.picture_flag,
                };
            }).filter(item =>
                item.countryName && item.answer && item.imageUrl
                && !this.isExcludedTerritory(item.countryName)
                && !this.isExcludedTerritory(item.answer)
            );
        } else if (category === "CURRENCIES") {
            const currencies = await this.moneyRepository.find({ relations: ["country", "territory"] });

            items = currencies.map(item => {
                const countryName = this.getCountryName(item) || "";
                const countryCode = this.getCountryCode(item);

                return {
                    countryName,
                    countryCode,
                    region: this.getRegion(countryCode),
                    answer: item.name_money,
                    imageUrl: null,
                };
            }).filter(item =>
                item.countryName && item.answer && !this.isExcludedTerritory(item.countryName)
            );
        } else {
            throw new Error("Catégorie de quiz invalide.");
        }

        const questionPool = items.filter((item, index, array) =>
            array.findIndex(other => category === "FLAGS"
                ? other.answer === item.answer
                : other.countryName === item.countryName && other.answer === item.answer
            ) === index
        );

        const questionCount: Record<QuizzDifficulty, number> = { easy: 10, medium: 20, hard: 30 };
        const selectedItems = this.shuffle(questionPool).slice(0, questionCount[difficulty]);

        return selectedItems.map(item => {
            const wrongAnswers = this.getWrongAnswers(item, questionPool, difficulty);
            let question: string;

            if (category === "CAPITALS") {
                question = item.localityType === "PRINCIPAL_CITY"
                    ? `Quelle est la ville principale de ${item.countryName} ?`
                    : `Quelle est la capitale de ${item.countryName} ?`;
            } else if (category === "FLAGS") {
                question = "À quel pays appartient ce drapeau ?";
            } else {
                question = `Quelle monnaie est utilisée en ${item.countryName} ?`;
            }

            return {
                question,
                correctAnswer: item.answer,
                choices: this.shuffle([item.answer, ...wrongAnswers]),
                imageUrl: item.imageUrl,
            };
        });
    }
}
