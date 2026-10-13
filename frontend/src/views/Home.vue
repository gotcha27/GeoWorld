<template>
  <div id="Home" style="height: 100vh;">
    <div class="map-container">
      <mapContainer @mapLoaded="onMapLoaded" />
    </div>
   
  </div>
</template>

<script setup>
import mapContainer from '../components/mapContainer.vue';

const apiUrl = import.meta.env.VITE_APP_API_URL;

console.log(apiUrl);

let mapLoaded = false;

const onMapLoaded = () => {
  mapLoaded = true;
};
</script>

<style scoped>
.text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

body {
  font-family: 'Archivo', sans-serif;
}

h1 {
  font-family: 'Archivo', sans-serif;
}

p {
  font-family: 'Archivo', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 30px;
}
</style>
