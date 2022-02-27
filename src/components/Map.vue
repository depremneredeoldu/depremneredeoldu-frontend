<template>
  <div id="mapContainer" class="basemap">
    <button id="test" @click="changeStyle()">Dark</button>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "BaseMap",
  data() {
    return {};
  },
  async created() {
    await this.$store.dispatch("earthquakes/fetchEarthquakes");
    this.initMap();
    this.addElement();

    if (this.isDataReceived) {
      console.log(this.getAllEarthquakeData.length);
      console.log(this.getFilteredMapFeatures);
    }
  },
  watch: {
    changeStyle() {
      this.setMapStyle();
    },
  },
  computed: {
    ...mapState("earthquakes", ["allEarthquakesInfo", "isDataReceived"]),
    ...mapState("map", ["isDarkModeEnabled"]),
    ...mapGetters("earthquakes", [
      "getAllEarthquakeData",
      "getFilteredMapFeatures",
    ]),
    ...mapGetters("map", ["getMapObject"]),
  },
  methods: {
    ...mapMutations("earthquakes", ["fetchData"]),
    ...mapMutations("map", ["initMap", "addPulsingDot", "setMapStyle"]),
    addElement() {
      for (const eachFeatureClass in this.getFilteredMapFeatures) {
        this.addPulsingDot(this.getFilteredMapFeatures[eachFeatureClass]);
      }
    },
  },
};
</script>

<style scoped>
.basemap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
#test {
  position: fixed;
  z-index: 1;
}
</style>