<!-- Affiche le formulaire de création de compte GeoWorld. -->
<template>
    <v-container class="auth-container" max-width="460">
        <v-card class="auth-card" rounded="xl" elevation="6">
            <v-card-title class="text-h5 text-center pt-6"
                >Créer un compte</v-card-title
            >
            <v-card-text class="pa-6">
                <v-alert
                    v-if="message"
                    :type="typeMessage"
                    class="mb-4"
                    closable
                    @click:close="message = ''"
                >
                    {{ message }}
                </v-alert>

                <v-form
                    v-model="valid"
                    @submit.prevent="inscrire"
                    autocomplete="off"
                >
                    <v-text-field
                        v-model="prenom"
                        label="Prénom"
                        autocomplete="off"
                        prepend-inner-icon="mdi-account-outline"
                        :rules="[
                            (v) => !!v?.trim() || 'Le prénom est obligatoire',
                        ]"
                        required
                    />
                    <v-text-field
                        v-model="nom"
                        label="Nom"
                        autocomplete="off"
                        prepend-inner-icon="mdi-account-outline"
                        :rules="[
                            (v) => !!v?.trim() || 'Le nom est obligatoire',
                        ]"
                        required
                    />
                    <v-text-field
                        v-model="pseudo"
                        label="Pseudo"
                        autocomplete="off"
                        prepend-inner-icon="mdi-at"
                        :rules="[
                            (v) => !!v?.trim() || 'Le pseudo est obligatoire',
                            (v) =>
                                v.trim().length >= 3 || '3 caractères minimum',
                            (v) =>
                                v.trim().length <= 20 ||
                                '20 caractères maximum',
                            (v) =>
                                /^[a-zA-Z0-9_]+$/.test(v.trim()) ||
                                'Lettres, chiffres et _ uniquement',
                        ]"
                        required
                    />
                    <v-text-field
                        v-model="email"
                        label="Adresse e-mail"
                        type="email"
                        autocomplete="off"
                        prepend-inner-icon="mdi-email-outline"
                        :rules="emailRules"
                        required
                    />
                    <v-text-field
                        v-model="password"
                        label="Mot de passe"
                        autocomplete="new-password"
                        prepend-inner-icon="mdi-lock-outline"
                        :type="showPassword ? 'text' : 'password'"
                        :append-inner-icon="
                            showPassword ? 'mdi-eye-off' : 'mdi-eye'
                        "
                        @click:append-inner="showPassword = !showPassword"
                        :rules="passwordRules"
                        required
                    />
                    <v-text-field
                        v-model="confirmation"
                        label="Confirmer le mot de passe"
                        autocomplete="new-password"
                        prepend-inner-icon="mdi-lock-check-outline"
                        :type="showConfirmation ? 'text' : 'password'"
                        :append-inner-icon="
                            showConfirmation ? 'mdi-eye-off' : 'mdi-eye'
                        "
                        @click:append-inner="
                            showConfirmation = !showConfirmation
                        "
                        :rules="[
                            (v) => !!v || 'La confirmation est obligatoire',
                            (v) =>
                                v === password ||
                                'Les mots de passe ne correspondent pas',
                        ]"
                        required
                    />

                    <v-btn
                        type="submit"
                        color="primary"
                        block
                        rounded="lg"
                        class="mt-4"
                        :disabled="!valid || chargement"
                        :loading="chargement"
                    >
                        Créer mon compte
                    </v-btn>
                </v-form>

                <div class="text-center mt-6">
                    Déjà inscrit ?
                    <router-link to="/connexion">Se connecter</router-link>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { inscrire as creerCompte } from "../services/authService";

const router = useRouter();
const valid = ref(false);
const prenom = ref("");
const nom = ref("");
const pseudo = ref("");
const email = ref("");
const password = ref("");
const confirmation = ref("");
const showPassword = ref(false);
const showConfirmation = ref(false);
const chargement = ref(false);
const message = ref("");
const typeMessage = ref("error");

const emailRules = [
    (v) => !!v || "L’adresse e-mail est obligatoire",
    (v) => /.+@.+\..+/.test(v) || "L’adresse e-mail est invalide",
];

const passwordRules = [
    (v) => !!v || "Le mot de passe est obligatoire",
    (v) => v.length >= 12 || "12 caractères minimum",
    (v) => /[A-Z]/.test(v) || "Au moins une majuscule",
    (v) => /[a-z]/.test(v) || "Au moins une minuscule",
    (v) => /[0-9]/.test(v) || "Au moins un chiffre",
    (v) => /[^A-Za-z0-9]/.test(v) || "Au moins un caractère spécial",
];

async function inscrire() {
    message.value = "";
    chargement.value = true;

    try {
        await creerCompte({
            firstName: prenom.value.trim(),
            name: nom.value.trim(),
            pseudoName: pseudo.value.trim(),
            mail: email.value.trim(),
            password: password.value,
            confirmPassword: confirmation.value,
        });

        typeMessage.value = "success";
        message.value = "Compte créé avec succès. Vous pouvez vous connecter.";
        setTimeout(() => router.push("/connexion"), 1200);
    } catch (error) {
        typeMessage.value = "error";
        message.value = error.message || "Impossible de créer le compte.";
    } finally {
        chargement.value = false;
    }
}
</script>

<style scoped>
.auth-container {
    margin-top: 80px;
}
.auth-card {
    padding: 8px;
}
:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: #222 !important;
    caret-color: #222;
}
</style>
