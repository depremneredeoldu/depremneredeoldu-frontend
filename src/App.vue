<template>
  <div id="app">
    <Mapbox />
  </div>
</template>

<script>
import Mapbox from "./components/Map.vue";

export default {
  name: "App",
  components: {
    Mapbox,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
