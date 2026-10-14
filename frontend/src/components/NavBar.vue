<!-- Affiche la navigation GeoWorld avec une recherche de pays. -->


<template>
    <v-app-bar id="navBar" class="bg-grey-lighten-3" fixed>
        <template #prepend>
            <router-link to="/" class="logo-container">
                <img class="logo" src="../pictures/logo1.webp" alt="GeoWorld" />
            </router-link>
        </template>

        <v-spacer />

        <v-btn
            v-if="authReady && !isLoggedIn"
            class="btn-1"
            to="/connexion"
            rounded="pill"
        >
            SE CONNECTER
        </v-btn>

        <template v-if="!isAuthPage">
            <div class="search-area">
                <v-expand-transition>
                    <div v-if="showSearch" class="search-fields">
                        <div class="search-field">
                            <v-text-field
                                :model-value="countryQuery"
                                placeholder="Rechercher un pays"
                                variant="outlined"
                                density="compact"
                                hide-details
                                clearable
                                aria-label="Rechercher un pays"
                                @update:model-value="updateCountryQuery"
                                @keydown.enter="runSearch"
                                @keydown.esc="closeSearch"
                            />
                            <v-btn icon size="small" aria-label="Rechercher un pays" @click="runSearch">
                                <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                        </div>
                    </div>
                </v-expand-transition>

                <v-btn v-if="!showSearch" icon aria-label="Ouvrir la recherche" @click="toggleSearch">
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>

                <v-btn v-else icon aria-label="Fermer la recherche" @click="closeSearch">
                    <v-icon>mdi-close</v-icon>
                </v-btn>

                <div v-if="showSearch && searchHasRun" class="search-results">
                    <div v-if="isSearching" class="search-message">Recherche en cours...</div>
                    <v-list v-else-if="searchResults.length" density="compact">
                        <v-list-item
                            v-for="result in searchResults"
                            :key="`${result.type}-${result.item.countryId ?? result.item.territoryId}`"
                            :title="getResultName(result)"
                            :subtitle="getResultDetails(result)"
                            :prepend-icon="result.type === 'territory' ? 'mdi-island' : 'mdi-earth'"
                            @click="selectSearchResult(result)"
                        />
                    </v-list>
                    <div v-else class="search-message">Aucun pays trouvé.</div>
                </div>
            </div>

            <v-menu>
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon aria-label="Menu">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                        v-if="isLoggedIn"
                        prepend-icon="mdi-logout"
                        title="Se déconnecter"
                        @click="logoutUser"
                    />
                </v-list>
            </v-menu>
        </template>
    </v-app-bar>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getAccessToken, deconnecter, restaurerSession } from "../services/authService";
import { useCountrySearch } from "../map/useCountrySearch";
import "vuetify/dist/vuetify.min.css";

const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(!!getAccessToken());
const authReady = ref(false);

const {
    showSearch,
    countryQuery,
    searchResults,
    isSearching,
    searchHasRun,
    toggleSearch,
    updateCountryQuery,
    closeSearch,
    getResultName,
    getResultDetails,
    runSearch,
    selectSearchResult,
} = useCountrySearch();

const isAuthPage = computed(
    () => ["/connexion", "/inscription"].includes(route.path) || route.name === "NotFound",
);

function updateLoginStatus() {
    isLoggedIn.value = !!getAccessToken();
}

async function logoutUser() {
    await deconnecter();
    updateLoginStatus();
    router.push("/connexion");
}

onMounted(async () => {
    window.addEventListener("connexion-changee", updateLoginStatus);
    await restaurerSession();
    updateLoginStatus();
    authReady.value = true;
});

onUnmounted(() => {
    window.removeEventListener("connexion-changee", updateLoginStatus);
});
</script>

<style scoped>
#navBar {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}

.logo-container {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.logo {
    display: block;
    max-width: 50px;
    height: auto;
    filter: invert(100%) sepia(100%) hue-rotate(180deg) saturate(1000%) contrast(1);
    cursor: pointer;
}

.btn-1 {
    border-radius: 24px;
    flex-shrink: 0;
}

.search-area {
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    z-index: 1100;
}

.search-fields {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.search-field {
    display: flex;
    align-items: center;
    width: 260px;
    gap: 2px;
}

.search-results {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: min(420px, calc(100vw - 24px));
    max-height: 65vh;
    overflow-y: auto;
    border: 1px solid rgba(125, 211, 252, 0.25);
    border-radius: 12px;
    background: #101a29;
    color: white;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    z-index: 1200;
}

.search-results :deep(.v-list-item-title) {
    color: white;
    font-weight: 600;
}

.search-results :deep(.v-list-item-subtitle) {
    white-space: normal;
    line-height: 1.4;
    margin-top: 4px;
}

.search-message {
    padding: 16px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
}

@media (max-width: 1200px) {
    .search-fields {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: min(360px, calc(100vw - 24px));
        padding: 12px;
        gap: 10px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 12px;
        background: #f5f5f5;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    }

    .search-field {
        width: 100%;
        min-width: 0;
    }
}

@media (max-width: 480px) {
    .logo {
        max-width: 40px;
    }

    .btn-1 {
        font-size: 11px;
        padding-inline: 10px;
    }
}
</style>

