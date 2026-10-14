
// Définit les routes de GeoWorld et protège les pages réservées aux utilisateurs connectés.
import { createRouter, createWebHistory } from "vue-router";
import { getAccessToken, restaurerSession } from "../services/authService";

import Home from "../views/Home.vue";
import Connexion from "../views/Connexion.vue";
import Inscription from "../views/Inscription.vue";
import Quizz from "../views/Quizz.vue";
import QuizzGame from "../views/QuizzGame.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
    {
        path: "/",
        component: Home,
        meta: { requiresAuth: true },
    },
    {
        path: "/quizz",
        component: Quizz,
        meta: { requiresAuth: true },
    },
    {
        path: "/quizz/jeu",
        component: QuizzGame,
        meta: { requiresAuth: true },
    },
    {
        path: "/quiz",
        redirect: "/quizz",
    },
    {
        path: "/connexion",
        component: Connexion,
    },
    {
        path: "/inscription",
        component: Inscription,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
    if (!to.meta.requiresAuth) return true;
    if (getAccessToken()) return true;

    await restaurerSession();

    if (getAccessToken()) return true;
    return { path: "/connexion" };
});

export default router;
