
// Effectue les requêtes vers le backend pour les pays, territoires et recherches.
const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getCountryByIsoCode(isoCode) {
    const response = await fetch(`${API_URL}/country/iso2/${isoCode}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.status === 400) return null;
    return data;
}

export async function getTerritoryByIsoCode(isoCode) {
    const response = await fetch(`${API_URL}/territory/iso2/${isoCode}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.status === 400) return null;
    return data;
}

export async function searchCountriesAndTerritories(query, type = "country") {
    try {
        const params = new URLSearchParams({ q: query, type });
        const response = await fetch(`${API_URL}/search?${params}`);

        if (!response.ok) {
            return { countries: [], territories: [] };
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur pendant la recherche :", error);
        return { countries: [], territories: [] };
    }
}

