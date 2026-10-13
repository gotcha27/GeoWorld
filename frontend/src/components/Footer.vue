<template>
    <v-footer id="footer" class="bg-grey-lighten-3">
      <v-row justify="center" no-gutters>
        <v-btn
          v-for="link in links"
          :key="link"
          color="dark"
          variant="text"
          class="mx-sm-5 mx-md-10"
          rounded="xl"
        >
          {{ link }}
        </v-btn>
    
      </v-row>
    </v-footer>
  </template>
  <script>
  export default {
    data: () => ({
      links: [
        'Home',
        'Services',
        'Contact',
      ],
    }),
  }
</script>
<style scoped>
#footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 15px;
}
.v-btn {
  padding: 6px 12px;
}
</style>