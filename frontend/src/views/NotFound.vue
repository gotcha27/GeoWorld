
<!-- Affiche une page 404 avec les composants Vuetify. -->
<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center" class="text-center">
      <v-col cols="12">
        <v-icon icon="mdi-map-marker-question-outline" size="80" color="primary" />
        <div class="text-h2 font-weight-bold mt-4">404</div>
        <div class="text-h5 mt-2">Page introuvable</div>
        <div class="text-body-1 mt-4 mb-6">
          La page que vous recherchez n'existe pas.
        </div>
        <v-btn to="/connexion" color="primary" prepend-icon="mdi-arrow-left">
          Retour à la connexion
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>