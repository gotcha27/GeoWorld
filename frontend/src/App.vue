
<!-- Affiche la structure générale de GeoWorld et masque la navbar pendant une partie. -->
<template>
    <v-app>
        <NavBar v-if="$route.path !== '/quizz/jeu'" />
        <router-view />
        <Footer v-if="!['/connexion', '/inscription', '/quizz/jeu'].includes($route.path)" />
    </v-app>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
</script>

<style>
body {
    margin: 0;
    padding: 0;
    font-family: "Archivo", sans-serif;
}

#app {
    min-height: 100vh;
}
</style>

```