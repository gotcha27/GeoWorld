
<!-- Affiche la configuration du quiz GeoWorld et charge les catégories depuis le backend. -->
<template>
    <v-container fluid class="quiz-page py-10 pb-16">
        <div class="background-glow glow-one"></div>
        <div class="background-glow glow-two"></div>

        <v-row justify="center">
            <v-col cols="12" xl="9" lg="10">
                <header class="quiz-header text-center mb-10">
                    <div class="hero-icon mx-auto mb-5">
                        <v-icon icon="mdi-earth" size="42" color="#67e8f9" />
                    </div>
                    <div class="eyebrow mb-3">
                        <span class="eyebrow-dot"></span>
                        GEO WORLD EXPERIENCE
                    </div>
                    <h1 class="hero-title">
                        GeoWorld <span>Quiz</span>
                    </h1>
                    <p class="hero-description mt-4">
                        Explore le monde, teste tes connaissances et relève le défi.
                    </p>
                </header>

                <v-card class="setup-card" rounded="xl" elevation="0">
                    <div class="card-top-line"></div>

                    <div class="setup-content">
                        <section class="quiz-section">
                            <div class="section-heading mb-5">
                                <div class="section-icon">
                                    <v-icon icon="mdi-shape-outline" size="23" />
                                </div>
                                <div>
                                    <h2>Choisis ta catégorie</h2>
                                    <p>Sélectionne le thème de ton prochain défi.</p>
                                </div>
                            </div>

                            <v-alert
                                v-if="categoryError"
                                type="error"
                                variant="tonal"
                                rounded="lg"
                                class="mb-5"
                            >
                                {{ categoryError }}
                                <template #append>
                                    <v-btn variant="text" color="error" size="small" @click="loadCategories">
                                        Réessayer
                                    </v-btn>
                                </template>
                            </v-alert>

                            <div v-if="loadingCategories" class="loading-state">
                                <v-progress-circular indeterminate color="#67e8f9" size="38" width="3" />
                                <p class="mt-4">Chargement des catégories...</p>
                            </div>

                            <v-alert
                                v-else-if="!categoryError && categories.length === 0"
                                type="info"
                                variant="tonal"
                                rounded="lg"
                            >
                                Aucune catégorie disponible pour le moment.
                            </v-alert>

                            <v-row v-else-if="!categoryError" dense>
                                <v-col
                                    v-for="category in categories"
                                    :key="category.code"
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-card
                                        class="option-card category-card"
                                        :class="{ 'option-selected': selectedCategory === category.code }"
                                        rounded="xl"
                                        elevation="0"
                                        tabindex="0"
                                        role="button"
                                        :aria-pressed="selectedCategory === category.code"
                                        @click="selectedCategory = category.code"
                                        @keydown.enter="selectedCategory = category.code"
                                        @keydown.space.prevent="selectedCategory = category.code"
                                    >
                                        <div class="option-card-content">
                                            <div class="option-icon">
                                                <v-icon :icon="category.icon" size="28" />
                                            </div>
                                            <div class="option-check">
                                                <v-icon
                                                    :icon="selectedCategory === category.code ? 'mdi-check-circle' : 'mdi-circle-outline'"
                                                    size="21"
                                                />
                                            </div>
                                            <h3>{{ category.name }}</h3>
                                            <p>{{ category.description || "Teste tes connaissances sur ce thème." }}</p>
                                        </div>
                                        <div v-if="selectedCategory === category.code" class="selected-indicator"></div>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </section>

                        <v-divider class="section-divider"></v-divider>

                        <section class="quiz-section">
                            <div class="section-heading mb-5">
                                <div class="section-icon">
                                    <v-icon icon="mdi-target" size="23" />
                                </div>
                                <div>
                                    <h2>Choisis ta difficulté</h2>
                                    <p>Adapte le défi à ton niveau.</p>
                                </div>
                            </div>

                            <v-row dense>
                                <v-col
                                    v-for="difficulty in difficulties"
                                    :key="difficulty.value"
                                    cols="12"
                                    sm="4"
                                >
                                    <v-card
                                        class="option-card difficulty-card"
                                        :class="{ 'option-selected': selectedDifficulty === difficulty.value }"
                                        rounded="xl"
                                        elevation="0"
                                        tabindex="0"
                                        role="button"
                                        :aria-pressed="selectedDifficulty === difficulty.value"
                                        @click="selectedDifficulty = difficulty.value"
                                        @keydown.enter="selectedDifficulty = difficulty.value"
                                        @keydown.space.prevent="selectedDifficulty = difficulty.value"
                                    >
                                        <div class="option-card-content">
                                            <div class="option-icon difficulty-icon" :class="`difficulty-${difficulty.value}`">
                                                <v-icon :icon="difficulty.icon" size="27" />
                                            </div>
                                            <div class="option-check">
                                                <v-icon
                                                    :icon="selectedDifficulty === difficulty.value ? 'mdi-check-circle' : 'mdi-circle-outline'"
                                                    size="21"
                                                />
                                            </div>
                                            <h3>{{ difficulty.label }}</h3>
                                            <p>{{ difficulty.description }}</p>
                                        </div>
                                        <div v-if="selectedDifficulty === difficulty.value" class="selected-indicator"></div>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </section>

                        <v-divider class="section-divider"></v-divider>

                        <section class="summary-section">
                            <div class="summary-icon">
                                <v-icon icon="mdi-clipboard-check-outline" size="24" />
                            </div>
                            <div class="summary-text">
                                <h3>Prêt à relever le défi ?</h3>
                                <p>
                                    <template v-if="currentCategory">{{ currentCategory.name }}</template>
                                    <template v-else>Choisis une catégorie</template>
                                    <span class="summary-separator">•</span>
                                    {{ currentDifficulty.label }}
                                </p>
                            </div>
                        </section>

                        <v-alert v-if="selectionError" type="warning" variant="tonal" rounded="lg" class="mt-5">
                            {{ selectionError }}
                        </v-alert>

                        <v-btn
                            class="start-button mt-6"
                            block
                            size="x-large"
                            rounded="lg"
                            :disabled="!selectedCategory || loadingCategories || !!categoryError"
                            @click="startQuiz"
                        >
                            <span>Commencer le quiz</span>
                            <v-icon icon="mdi-arrow-right" class="ml-3" />
                        </v-btn>

                        <p class="footer-note text-center mt-4">
                            <v-icon icon="mdi-earth" size="15" class="mr-1" />
                            Le monde n'attend que toi.
                        </p>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCategories } from "../services/categoryService";

const router = useRouter();
const categories = ref([]);
const loadingCategories = ref(true);
const categoryError = ref("");
const selectionError = ref("");

const selectedCategory = ref(null);
const selectedDifficulty = ref("easy");

const categoryIcons = {
    CAPITALS: "mdi-city-variant-outline",
    FLAGS: "mdi-flag-outline",
    CURRENCIES: "mdi-cash-multiple",
};

const difficulties = [
    {
        value: "easy",
        label: "Facile",
        description: "Pour commencer",
        icon: "mdi-sprout-outline",
    },
    {
        value: "medium",
        label: "Moyenne",
        description: "Pour se challenger",
        icon: "mdi-target",
    },
    {
        value: "hard",
        label: "Difficile",
        description: "Pour les experts",
        icon: "mdi-lightning-bolt-outline",
    },
];

const currentCategory = computed(() =>
    categories.value.find(category => category.code === selectedCategory.value)
);

const currentDifficulty = computed(() =>
    difficulties.find(difficulty => difficulty.value === selectedDifficulty.value) || difficulties[0]
);

async function loadCategories() {
    loadingCategories.value = true;
    categoryError.value = "";
    selectionError.value = "";

    try {
        const data = await getCategories();

        categories.value = data.map(category => ({
            code: category.code_category,
            name: category.name_category,
            description: category.description,
            icon: categoryIcons[category.code_category] || "mdi-earth",
        }));

        if (!categories.value.some(category => category.code === selectedCategory.value)) {
            selectedCategory.value = categories.value[0]?.code || null;
        }
    } catch (error) {
        console.error("Erreur de chargement des catégories :", error);
        categoryError.value = "Impossible de charger les catégories. Vérifie que le backend est démarré.";
        categories.value = [];
        selectedCategory.value = null;
    } finally {
        loadingCategories.value = false;
    }
}

function startQuiz() {
    selectionError.value = "";

    if (!selectedCategory.value) {
        selectionError.value = "Choisis une catégorie avant de commencer.";
        return;
    }

    router.push({
        path: "/quizz/jeu",
        query: {
            category: selectedCategory.value,
            difficulty: selectedDifficulty.value,
        },
    });
}

onMounted(loadCategories);
</script>

<style scoped>
.quiz-page {
    position: relative;
    min-height: calc(100vh - 100px);
    overflow: hidden;
    background: #07111f;
    color: #e5edf8;
    isolation: isolate;
}

.background-glow {
    position: absolute;
    z-index: -1;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.12;
    pointer-events: none;
}

.glow-one {
    top: 30px;
    left: -180px;
    background: #0891b2;
}

.glow-two {
    top: 300px;
    right: -200px;
    background: #2563eb;
}

.quiz-header {
    position: relative;
}

.hero-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 76px;
    height: 76px;
    border: 1px solid rgba(103, 232, 249, 0.3);
    border-radius: 24px;
    background: rgba(8, 145, 178, 0.12);
    box-shadow: 0 0 45px rgba(34, 211, 238, 0.1);
}

.eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    color: #67e8f9;
    font-size: 0.73rem;
    font-weight: 700;
    letter-spacing: 0.2em;
}

.eyebrow-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #67e8f9;
    box-shadow: 0 0 12px rgba(103, 232, 249, 0.7);
}

.hero-title {
    color: #f8fafc;
    font-size: clamp(2.5rem, 6vw, 4.3rem);
    font-weight: 800;
    letter-spacing: -0.055em;
    line-height: 1.1;
}

.hero-title span {
    color: #67e8f9;
}

.hero-description {
    max-width: 540px;
    margin-right: auto;
    margin-left: auto;
    color: #94a3b8;
    font-size: 1.05rem;
    line-height: 1.7;
}

.setup-card {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.15);
    background: rgba(12, 25, 43, 0.92);
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
}

.card-top-line {
    height: 3px;
    background: linear-gradient(90deg, transparent, #22d3ee, #3b82f6, transparent);
}

.setup-content {
    padding: clamp(20px, 4vw, 40px);
}

.quiz-section {
    position: relative;
}

.section-heading {
    display: flex;
    align-items: center;
    gap: 15px;
}

.section-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border: 1px solid rgba(103, 232, 249, 0.18);
    border-radius: 14px;
    background: rgba(8, 145, 178, 0.12);
    color: #67e8f9;
}

.section-heading h2 {
    color: #f1f5f9;
    font-size: 1.15rem;
    font-weight: 700;
}

.section-heading p {
    margin-top: 4px;
    color: #8495aa;
    font-size: 0.88rem;
}

.option-card {
    position: relative;
    height: 100%;
    min-height: 178px;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.15);
    background: rgba(15, 31, 51, 0.75);
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.option-card:hover {
    transform: translateY(-3px);
    border-color: rgba(103, 232, 249, 0.45);
    background: rgba(17, 39, 61, 0.95);
}

.option-card:focus-visible {
    outline: 2px solid #67e8f9;
    outline-offset: 3px;
}

.option-selected {
    border-color: rgba(103, 232, 249, 0.75);
    background: rgba(8, 145, 178, 0.13);
    box-shadow: inset 0 0 0 1px rgba(103, 232, 249, 0.08);
}

.option-card-content {
    position: relative;
    padding: 22px;
}

.option-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    margin-bottom: 20px;
    border: 1px solid rgba(103, 232, 249, 0.2);
    border-radius: 15px;
    background: rgba(8, 145, 178, 0.13);
    color: #67e8f9;
}

.option-check {
    position: absolute;
    top: 25px;
    right: 20px;
    color: #52657b;
}

.option-selected .option-check {
    color: #67e8f9;
}

.option-card h3 {
    margin-bottom: 7px;
    color: #f1f5f9;
    font-size: 1.02rem;
    font-weight: 700;
}

.option-card p {
    color: #91a2b7;
    font-size: 0.85rem;
    line-height: 1.55;
}

.selected-indicator {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #22d3ee, #3b82f6);
}

.difficulty-card {
    min-height: 160px;
}

.difficulty-card .option-card-content {
    padding: 20px;
}

.difficulty-card .option-icon {
    width: 44px;
    height: 44px;
    margin-bottom: 16px;
}

.difficulty-easy {
    border-color: rgba(74, 222, 128, 0.2);
    background: rgba(22, 163, 74, 0.1);
    color: #4ade80;
}

.difficulty-medium {
    border-color: rgba(251, 191, 36, 0.2);
    background: rgba(217, 119, 6, 0.1);
    color: #fbbf24;
}

.difficulty-hard {
    border-color: rgba(248, 113, 113, 0.2);
    background: rgba(220, 38, 38, 0.1);
    color: #f87171;
}

.section-divider {
    margin: 32px 0;
    border-color: rgba(148, 163, 184, 0.13);
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 160px;
    color: #94a3b8;
    font-size: 0.9rem;
}

.summary-section {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 18px;
    border: 1px solid rgba(103, 232, 249, 0.14);
    border-radius: 16px;
    background: rgba(8, 145, 178, 0.07);
}

.summary-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 13px;
    background: rgba(8, 145, 178, 0.16);
    color: #67e8f9;
}

.summary-text h3 {
    color: #e2e8f0;
    font-size: 0.98rem;
    font-weight: 700;
}

.summary-text p {
    margin-top: 5px;
    color: #94a3b8;
    font-size: 0.88rem;
}

.summary-separator {
    margin: 0 8px;
    color: #67e8f9;
}

.start-button {
    height: 58px !important;
    background: linear-gradient(100deg, #0891b2, #2563eb);
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    box-shadow: 0 8px 28px rgba(8, 145, 178, 0.2);
    transition: filter 0.2s ease, transform 0.2s ease;
}

.start-button:hover:not(:disabled) {
    transform: translateY(-2px);
    filter: brightness(1.12);
}

.start-button:disabled {
    background: #26384c;
    color: #74869b;
    box-shadow: none;
}

.footer-note {
    color: #64748b;
    font-size: 0.8rem;
}

@media (max-width: 600px) {
    .quiz-page {
        padding-right: 12px;
        padding-left: 12px;
    }

    .setup-content {
        padding: 20px 16px;
    }

    .hero-description {
        font-size: 0.95rem;
    }

    .section-heading {
        align-items: flex-start;
    }

    .option-card {
        min-height: 150px;
    }
}
</style>
