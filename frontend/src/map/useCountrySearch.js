
/* Gère la recherche des pays et territoires dans GeoWorld. */

import { ref } from "vue";
import { searchCountriesAndTerritories } from "../services/countryService";

export function useCountrySearch() {
    const showSearch = ref(false);
    const countryQuery = ref("");
    const searchResults = ref([]);
    const isSearching = ref(false);
    const searchHasRun = ref(false);
    let searchRequestId = 0;

    function toggleSearch() {
        showSearch.value = true;
    }

    function resetResults() {
        searchResults.value = [];
        searchHasRun.value = false;
        isSearching.value = false;
        searchRequestId++;
    }

    function updateCountryQuery(value) {
        countryQuery.value = value ?? "";
        resetResults();
    }

    function closeSearch() {
        showSearch.value = false;
        countryQuery.value = "";
        resetResults();
    }

    function getResultName(result) {
        return result.type === "territory"
            ? result.item.name_territory
            : result.item.name_country;
    }

    function getResultDetails(result) {
        const item = result.item;
        const capital = item.capital?.name_capital || "Capitale inconnue";
        const money = item.money?.name_money || "Monnaie inconnue";

        if (result.type === "territory") {
            return `Territoire de ${item.country?.name_country || "rattachement inconnu"} · ${capital} · ${money}`;
        }

        return `Pays · ${capital} · ${money}`;
    }

    function normalizeName(value) {
        return (value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLocaleLowerCase("fr");
    }

    async function runSearch() {
        const query = countryQuery.value.trim();
        if (!query) return;

        const requestId = ++searchRequestId;
        searchHasRun.value = true;
        isSearching.value = true;
        searchResults.value = [];

        try {
            const data = await searchCountriesAndTerritories(query, "country");

            if (requestId !== searchRequestId) return;

            const countries = (data.countries || []).map((item) => ({
                type: "country",
                item,
            }));

            const territories = (data.territories || []).map((item) => ({
                type: "territory",
                item,
            }));

            const results = [...countries, ...territories];
            searchResults.value = results.slice(0, 12);

            const normalizedQuery = normalizeName(query);

            const exactMatch =
                results.find(
                    (result) =>
                        result.type === "country" &&
                        normalizeName(getResultName(result)) === normalizedQuery,
                ) ||
                results.find(
                    (result) =>
                        normalizeName(getResultName(result)) === normalizedQuery,
                );

            if (exactMatch) {
                selectSearchResult(exactMatch);
            }
        } catch (error) {
            if (requestId !== searchRequestId) return;

            console.error("Erreur pendant la recherche de pays :", error);
            searchResults.value = [];
        } finally {
            if (requestId === searchRequestId) {
                isSearching.value = false;
            }
        }
    }

    function selectSearchResult(result) {
        window.dispatchEvent(
            new CustomEvent("geoworld-search-select", { detail: result }),
        );
        closeSearch();
    }

    return {
        showSearch,
        countryQuery,
        searchResults,
        isSearching,
        searchHasRun,
        toggleSearch,
        resetResults,
        updateCountryQuery,
        closeSearch,
        getResultName,
        getResultDetails,
        runSearch,
        selectSearchResult,
    };
}