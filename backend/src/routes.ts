// Définit les routes HTTP de l'API GeoWorld.
import { capitalController } from "./controller/capitalController";
import { continentController } from "./controller/continentController";
import { countryController } from "./controller/countryController";
import { difficultyController } from "./controller/difficultyController";
import { flagController } from "./controller/flagController";
import { moneyController } from "./controller/moneyController";
import { questionController } from "./controller/questionController";
import { storyController } from "./controller/storyController";
import { userController } from "./controller/userController";
import { TerritoryController } from "./controller/territoryController";
import { authMiddleware } from "./middleware/authMiddleware";
import { SearchController } from "./controller/searchController";

export const Routes = [
    // Routes utilisateurs
    {
        method: "get",
        route: "/users",
        controller: userController,
        action: "all",
    },
    {
        method: "get",
        route: "/users/:userId",
        controller: userController,
        action: "one",
        middlewares: [authMiddleware],
    },
    {
        method: "post",
        route: "/users",
        controller: userController,
        action: "save",
    },
    {
        method: "post",
        route: "/login",
        controller: userController,
        action: "login",
    },
    {
        method: "put",
        route: "/users/:userId/password",
        controller: userController,
        action: "updatePassword",
        middlewares: [authMiddleware],
    },
    {
        method: "delete",
        route: "/users/:userId",
        controller: userController,
        action: "remove",
        middlewares: [authMiddleware],
    },
    // Route de renouvellement de l'access token.
    {
        method: "post",
        route: "/refresh",
        controller: userController,
        action: "refresh",
    },
    // Route de déconnexion et de révocation du refresh token.
    {
        method: "post",
        route: "/logout",
        controller: userController,
        action: "logout",
    },

    // Routes capitales
    {
        method: "get",
        route: "/capitals",
        controller: capitalController,
        action: "all",
    },
    {
        method: "get",
        route: "/capital/:capitalId",
        controller: capitalController,
        action: "one",
    },
    {
        method: "post",
        route: "/capital",
        controller: capitalController,
        action: "save",
    },

    // Routes drapeaux
    {
        method: "get",
        route: "/flags",
        controller: flagController,
        action: "all",
    },
    {
        method: "get",
        route: "/flag/:flagId",
        controller: flagController,
        action: "one",
    },
    {
        method: "post",
        route: "/flag",
        controller: flagController,
        action: "save",
    },

    // Routes monnaies
    {
        method: "get",
        route: "/moneys",
        controller: moneyController,
        action: "all",
    },
    {
        method: "get",
        route: "/money/:moneyId",
        controller: moneyController,
        action: "one",
    },
    {
        method: "post",
        route: "/money",
        controller: moneyController,
        action: "save",
    },

    // Routes pays
    {
        method: "get",
        route: "/countries",
        controller: countryController,
        action: "all",
    },
    {
        method: "get",
        route: "/country/:countryId",
        controller: countryController,
        action: "one",
    },
    {
        method: "get",
        route: "/country/iso/:isoCode",
        controller: countryController,
        action: "oneByIsoCode",
    },
    {
        method: "get",
        route: "/country/iso2/:isoCode2",
        controller: countryController,
        action: "oneByIsoCode2",
    },
    {
        method: "post",
        route: "/country",
        controller: countryController,
        action: "save",
    },

    // Routes territoires
    {
        method: "get",
        route: "/territory/iso2/:isoCode2",
        controller: TerritoryController,
        action: "oneByIsoCode2",
    },

    // Routes continents
    {
        method: "get",
        route: "/continents",
        controller: continentController,
        action: "all",
    },
    {
        method: "get",
        route: "/continent/:continentId",
        controller: continentController,
        action: "one",
    },
    {
        method: "post",
        route: "/continent",
        controller: continentController,
        action: "save",
    },

    // Routes questions
    {
        method: "get",
        route: "/questions",
        controller: questionController,
        action: "all",
    },
    {
        method: "get",
        route: "/question/:questionId",
        controller: questionController,
        action: "one",
    },

    // Routes difficultés
    {
        method: "get",
        route: "/difficulties",
        controller: difficultyController,
        action: "all",
    },
    {
        method: "get",
        route: "/difficulty/:difficultyId",
        controller: difficultyController,
        action: "one",
    },

    // Routes historiques
    {
        method: "get",
        route: "/stories",
        controller: storyController,
        action: "all",
    },
    {
        method: "get",
        route: "/story/:storyId",
        controller: storyController,
        action: "one",
    },
    {
        method: "post",
        route: "/story",
        controller: storyController,
        action: "save",
    },
    // Route de recherche.
{
    method: "get",
    route: "/search",
    controller: SearchController,
    action: "search",
},
];
