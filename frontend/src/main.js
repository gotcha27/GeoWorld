import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'ol/ol.css';
import { createVuetify } from 'vuetify'; 
import 'vuetify/dist/vuetify.min.css';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.min.css';


const app = createApp(App);
const vuetify = createVuetify({
    components,
    directives,
  })
app.use(vuetify);
app.use(router);
app.mount("#app");
