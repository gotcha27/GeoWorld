
/* Gère les requêtes d'authentification et le renouvellement des tokens GeoWorld. */

const API_URL = import.meta.env.VITE_APP_API_URL;
let accessToken = null;
let refreshPromise = null;

export function getAccessToken() {
    return accessToken;
}

export async function connecter(mail, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mail, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Connexion impossible.");
    }

    accessToken = data.accessToken;
    window.dispatchEvent(new Event('connexion-changee'));

    return data;
}

export async function inscrire({ name, firstName, pseudoName, mail, password, confirmPassword }) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, firstName, pseudoName, mail, password, confirmPassword })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Création du compte impossible.");
    }

    return data;
}

export async function renouvelerToken() {
    if (!refreshPromise) {
        refreshPromise = fetch(`${API_URL}/refresh`, {
            method: "POST",
            credentials: "include"
        })
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    accessToken = null;
                    window.dispatchEvent(new Event('connexion-changee'));
                    throw new Error(data.message || "Session expirée.");
                }

                accessToken = data.accessToken;
                window.dispatchEvent(new Event('connexion-changee'));

                return accessToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}
let sessionRestorePromise = null;
let sessionRestored = false;

export async function restaurerSession() {
    if (sessionRestored) return getAccessToken();

    if (!sessionRestorePromise) {
        sessionRestorePromise = renouvelerToken()
            .catch(() => null)
            .then(() => {
                sessionRestored = true;
                return getAccessToken();
            })
            .finally(() => {
                sessionRestorePromise = null;
            });
    }

    return sessionRestorePromise;
}

export async function requeteAuthentifiee(url, options = {}) {
    const envoyer = () => fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        credentials: "include"
    });

    let response = await envoyer();

    if (response.status === 401) {
        await renouvelerToken();
        response = await envoyer();
    }

    return response;
}

export async function deconnecter() {
    try {
        await fetch(`${API_URL}/logout`, {
            method: "POST",
            credentials: "include"
        });
    } finally {
        accessToken = null;
        window.dispatchEvent(new Event('connexion-changee'));
    }
}

