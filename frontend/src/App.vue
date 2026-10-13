<!-- Affiche la structure générale de GeoWorld et la page sélectionnée par le routeur. -->
<template>
    <v-app>
        <NavBar />
        <router-view />
        <Footer v-if="!['/connexion', '/inscription'].includes($route.path)" />
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
