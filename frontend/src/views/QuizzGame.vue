<!-- Affiche une partie de quiz GeoWorld avec un texte lisible, une progression et un score. -->
<template>
    <v-container class="game-page py-8">
        <v-row justify="center">
            <v-col cols="12" md="9" lg="8">
                <v-btn
                    variant="flat"
                    class="return-btn mb-6"
                    prepend-icon="mdi-arrow-left"
                    @click="retourConfiguration"
                >
                    Retour au choix du quiz
                </v-btn>

                <v-card
                    class="game-card pa-5 pa-md-8"
                    rounded="xl"
                    elevation="8"
                >
                    <template v-if="loading">
                        <div class="text-center py-12">
                            <v-progress-circular
                                indeterminate
                                color="cyan"
                                size="56"
                            />
                            <p class="mt-5 secondary-text">
                                Préparation de ton quiz...
                            </p>
                        </div>
                    </template>

                    <template v-else-if="error">
                        <div class="text-center py-8">
                            <v-icon color="error" size="64"
                                >mdi-alert-circle-outline</v-icon
                            >
                            <h2 class="text-h5 mt-4">
                                Impossible de lancer le quiz
                            </h2>
                            <p class="secondary-text mt-3">{{ error }}</p>
                            <v-btn
                                color="cyan"
                                class="mt-6"
                                @click="chargerQuestions"
                                >Réessayer</v-btn
                            >
                        </div>
                    </template>

                    <template v-else-if="termine">
                        <div class="text-center py-8">
                            <v-icon :color="couleurResultat" size="80">{{
                                iconeResultat
                            }}</v-icon>
                            <h1 class="text-h4 font-weight-bold mt-4">
                                Quiz terminé !
                            </h1>
                            <p class="secondary-text mt-3">
                                Voici ton résultat
                            </p>

                            <div class="score-circle mx-auto my-8">
                                <span class="text-h3 font-weight-bold">{{
                                    score
                                }}</span>
                                <span class="secondary-text"
                                    >/ {{ questions.length }}</span
                                >
                            </div>

                            <h2 class="text-h5 mb-2">{{ messageResultat }}</h2>
                            <p class="secondary-text">
                                Tu as obtenu
                                {{
                                    Math.round((score / questions.length) * 100)
                                }}
                                % de bonnes réponses.
                            </p>

                            <div
                                class="d-flex flex-column flex-sm-row justify-center ga-3 mt-8"
                            >
                                <v-btn
                                    color="cyan"
                                    size="large"
                                    prepend-icon="mdi-refresh"
                                    @click="chargerQuestions"
                                >
                                    Rejouer
                                </v-btn>
                                <v-btn
                                    variant="outlined"
                                    color="cyan"
                                    size="large"
                                    @click="retourConfiguration"
                                >
                                    Changer de quiz
                                </v-btn>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <div
                            class="d-flex justify-space-between align-center flex-wrap ga-3 mb-5"
                        >
                            <v-chip color="cyan" variant="tonal">{{
                                nomCategorie
                            }}</v-chip>
                            <span class="secondary-text"
                                >Question {{ indexQuestion + 1 }} /
                                {{ questions.length }}</span
                            >
                        </div>

                        <v-progress-linear
                            :model-value="
                                ((indexQuestion + 1) / questions.length) * 100
                            "
                            color="cyan"
                            bg-color="blue-grey-darken-3"
                            rounded
                            height="7"
                            class="mb-8"
                        />

                        <h1
                            class="question-title text-h5 text-md-h4 font-weight-bold text-center mb-6"
                        >
                            {{ questionActuelle.question }}
                        </h1>

                        <v-img
                            v-if="questionActuelle.imageUrl"
                            :src="questionActuelle.imageUrl"
                            :alt="`Illustration de la question ${indexQuestion + 1}`"
                            max-width="260"
                            height="155"
                            contain
                            class="mx-auto mb-8 flag-image"
                        >
                            <template #error>
                                <div
                                    class="d-flex align-center justify-center fill-height secondary-text"
                                >
                                    <v-icon size="48">mdi-flag-outline</v-icon>
                                </div>
                            </template>
                        </v-img>

                        <v-row>
                            <v-col
                                v-for="(
                                    choix, index
                                ) in questionActuelle.choices"
                                :key="choix"
                                cols="12"
                                sm="6"
                            >
                                <v-btn
                                    block
                                    size="large"
                                    min-height="64"
                                    class="answer-btn text-none"
                                    :color="couleurChoix(choix)"
                                    :variant="
                                        selectedAnswer === choix ||
                                        (selectedAnswer !== null &&
                                            choix ===
                                                questionActuelle.correctAnswer)
                                            ? 'flat'
                                            : 'outlined'
                                    "
                                    :disabled="selectedAnswer !== null"
                                    @click="selectionnerReponse(choix)"
                                >
                                    <span class="answer-letter mr-3">{{
                                        String.fromCharCode(65 + index)
                                    }}</span>
                                    <span class="answer-text">{{ choix }}</span>
                                    <v-spacer />
                                    <v-icon
                                        v-if="
                                            selectedAnswer !== null &&
                                            choix ===
                                                questionActuelle.correctAnswer
                                        "
                                        class="ml-2"
                                        >mdi-check-circle</v-icon
                                    >
                                    <v-icon
                                        v-else-if="selectedAnswer === choix"
                                        class="ml-2"
                                        >mdi-close-circle</v-icon
                                    >
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-expand-transition>
                            <v-alert
                                v-if="selectedAnswer !== null"
                                :type="
                                    selectedAnswer ===
                                    questionActuelle.correctAnswer
                                        ? 'success'
                                        : 'error'
                                "
                                variant="tonal"
                                rounded="lg"
                                class="mt-6"
                            >
                                <strong>
                                    {{
                                        selectedAnswer ===
                                        questionActuelle.correctAnswer
                                            ? "Bonne réponse !"
                                            : "Pas tout à fait !"
                                    }}
                                </strong>
                                <div
                                    v-if="
                                        selectedAnswer !==
                                        questionActuelle.correctAnswer
                                    "
                                    class="mt-1"
                                >
                                    La bonne réponse était :
                                    {{ questionActuelle.correctAnswer }}
                                </div>
                            </v-alert>
                        </v-expand-transition>

                        <div
                            class="d-flex justify-space-between align-center mt-8 ga-3"
                        >
                            <div class="score-label">
                                <v-icon color="cyan" class="mr-1"
                                    >mdi-star</v-icon
                                >
                                <span class="font-weight-bold">{{
                                    score
                                }}</span>
                                <span class="secondary-text"> point(s)</span>
                            </div>
                            <v-btn
                                color="cyan"
                                size="large"
                                :disabled="selectedAnswer === null"
                                append-icon="mdi-arrow-right"
                                @click="questionSuivante"
                            >
                                {{
                                    indexQuestion === questions.length - 1
                                        ? "Voir le résultat"
                                        : "Continuer"
                                }}
                            </v-btn>
                        </div>
                    </template>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const API_URL = import.meta.env.VITE_APP_API_URL;

const questions = ref([]);
const indexQuestion = ref(0);
const selectedAnswer = ref(null);
const score = ref(0);
const loading = ref(true);
const error = ref("");
const termine = ref(false);

const category = computed(() => String(route.query.category || ""));
const difficulty = computed(() => String(route.query.difficulty || ""));

const categories = {
    CAPITALS: "Capitales",
    FLAGS: "Drapeaux",
    CURRENCIES: "Monnaies",
};

const nomCategorie = computed(
    () => categories[category.value] || "Quiz GeoWorld",
);
const questionActuelle = computed(() => questions.value[indexQuestion.value]);

const messageResultat = computed(() => {
    const pourcentage = score.value / questions.value.length;
    if (pourcentage === 1) return "Parfait ! Tu maîtrises le sujet !";
    if (pourcentage >= 0.7) return "Très bien joué !";
    if (pourcentage >= 0.4) return "Pas mal, continue comme ça !";
    return "Continue à t'entraîner, tu vas progresser !";
});

const couleurResultat = computed(() =>
    score.value / questions.value.length >= 0.7 ? "cyan" : "orange",
);
const iconeResultat = computed(() =>
    score.value / questions.value.length >= 0.7 ? "mdi-trophy" : "mdi-school",
);

async function chargerQuestions() {
    if (
        !categories[category.value] ||
        !["easy", "medium", "hard"].includes(difficulty.value)
    ) {
        error.value =
            "Catégorie ou difficulté manquante. Retourne à la configuration pour lancer un quiz.";
        loading.value = false;
        return;
    }

    loading.value = true;
    error.value = "";
    questions.value = [];
    indexQuestion.value = 0;
    selectedAnswer.value = null;
    score.value = 0;
    termine.value = false;

    try {
        const params = new URLSearchParams({
            category: category.value,
            difficulty: difficulty.value,
        });
        const response = await fetch(`${API_URL}/quiz/questions?${params}`);

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(
                data.message || "Le serveur n'a pas pu générer les questions.",
            );
        }

        const data = await response.json();
        if (!Array.isArray(data.questions) || data.questions.length === 0) {
            throw new Error("Aucune question disponible pour cette catégorie.");
        }

        questions.value = data.questions;
    } catch (err) {
        error.value = err.message || "Une erreur est survenue.";
    } finally {
        loading.value = false;
    }
}

function selectionnerReponse(choix) {
    if (selectedAnswer.value !== null) return;
    selectedAnswer.value = choix;
    if (choix === questionActuelle.value.correctAnswer) score.value++;
}

function questionSuivante() {
    if (selectedAnswer.value === null) return;

    if (indexQuestion.value < questions.value.length - 1) {
        indexQuestion.value++;
        selectedAnswer.value = null;
    } else {
        termine.value = true;
    }
}

function couleurChoix(choix) {
    if (selectedAnswer.value === null) return "cyan";
    if (choix === questionActuelle.value.correctAnswer) return "success";
    if (choix === selectedAnswer.value) return "error";
    return "blue-grey";
}

function retourConfiguration() {
    router.push("/quizz");
}

onMounted(chargerQuestions);
</script>

<style scoped>

.game-page {
    min-height: 100vh;
    width: 100%;
    max-width: none;
    margin: 0;
    color: #f1f5f9;
    background:
        radial-gradient(ellipse at 50% 0%, rgba(8, 145, 178, 0.18), transparent 55%),
        linear-gradient(145deg, #030712 0%, #071426 50%, #0b1830 100%);
}
.return-btn {
    min-height: 46px;
    padding: 0 20px;
    color: #ecfeff;
    background: rgba(8, 145, 178, 0.2);
    border: 1px solid rgba(103, 232, 249, 0.65);
    border-radius: 12px;
    font-weight: 700;
    letter-spacing: 0.2px;
    box-shadow: 0 4px 18px rgba(0, 229, 255, 0.1);
}
.return-btn:hover {
    background: rgba(8, 145, 178, 0.38);
}

.game-card {
    color: #f1f5f9;
    background: linear-gradient(145deg, #111c32, #0b1222);
    border: 1px solid rgba(0, 229, 255, 0.16);
}
.question-title {
    color: #f8fafc;
    line-height: 1.4;
}
.secondary-text {
    color: #cbd5e1 !important;
}
.answer-btn {
    white-space: normal;
    border-color: rgba(0, 229, 255, 0.4);
    justify-content: flex-start;
    padding: 0 16px;
}
.answer-text {
    color: #f1f5f9;
    text-align: left;
    white-space: normal;
}
.answer-letter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(0, 229, 255, 0.12);
    color: #67e8f9;
    font-weight: 700;
}
.flag-image {
    border-radius: 10px;
}
.score-circle {
    width: 150px;
    height: 150px;
    border: 5px solid #00e5ff;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    box-shadow: 0 0 28px rgba(0, 229, 255, 0.15);
}
.score-label {
    color: #f1f5f9;
}
</style>
