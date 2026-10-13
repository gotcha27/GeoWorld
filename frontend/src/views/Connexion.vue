```vue
<!-- Affiche le formulaire de connexion et transmet les identifiants au backend. -->
<template>
  <v-container class="auth-container" max-width="460">
    <v-card class="auth-card" rounded="xl" elevation="6">
      <v-card-title class="text-h5 text-center pt-6">Connexion</v-card-title>
      <v-card-text class="pa-6">
        <v-alert v-if="message" :type="typeMessage" class="mb-4" closable @click:close="message = ''">
          {{ message }}
        </v-alert>

        <v-form v-model="valid" @submit.prevent="connecter" autocomplete="off">
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
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            :rules="[v => !!v || 'Le mot de passe est obligatoire']"
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
            Se connecter
          </v-btn>
        </v-form>

        <div class="text-center mt-6">
          Pas encore de compte ?
          <router-link to="/inscription">Créer un compte</router-link>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { connecter as seConnecter } from '../services/authService';

const router = useRouter();
const valid = ref(false);
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const chargement = ref(false);
const message = ref('');
const typeMessage = ref('error');

const emailRules = [
  v => !!v || 'L’adresse e-mail est obligatoire',
  v => /.+@.+\..+/.test(v) || 'L’adresse e-mail est invalide',
];

async function connecter() {
  message.value = '';
  chargement.value = true;

  try {
    await seConnecter(email.value.trim(), password.value);
    router.push('/');
  } catch (error) {
    message.value = error.message || 'Impossible de se connecter.';
  } finally {
    chargement.value = false;
  }
}
</script>

<style scoped>
.auth-container { margin-top: 100px; }
.auth-card { padding: 8px; }
:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #222 !important;
  caret-color: #222;
}
</style>
```
