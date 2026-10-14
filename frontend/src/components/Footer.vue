
<!-- Affiche la navigation principale de GeoWorld en bas de page. -->
<template>
    <v-footer id="footer" class="bg-grey-lighten-3">
        <v-row justify="center" align="center" no-gutters>
            <v-btn
                v-for="link in links"
                :key="link.title"
                :to="link.to"
                color="dark"
                variant="text"
                class="mx-sm-2 mx-md-5"
                rounded="xl"
            >
                {{ link.title }}
            </v-btn>
        </v-row>
    </v-footer>
</template>

<script>
export default {
    data: () => ({
        links: [
            { title: "Accueil", to: "/" },
            { title: "Quiz", to: "/quiz" },
            { title: "Historique", to: "/historique" },
            { title: "Profil", to: "/profil" },
        ],
    }),
};
</script>

<style scoped>
#footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 15px;
    z-index: 10;
}

.v-btn {
    padding: 6px 12px;
}
</style>
