
// Récupère les catégories de quiz depuis le backend.
const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getCategories() {
    const response = await fetch(`${API_URL}/category`);

    if (!response.ok) {
        throw new Error("Impossible de récupérer les catégories.");
    }

    return await response.json();
}
