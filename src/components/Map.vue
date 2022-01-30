<template>
  <div id="mapContainer" class="basemap">
    <button id="test" @click="testConsole()">Dark</button>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "BaseMap",
  data() {
    return {
      accessToken: process.env.VUE_APP_MAP_API_KEY,
      isDarkModeEnabled: false,
      lightMapStyle: "mapbox://styles/mapbox/streets-v11",
      darkMapStyle: "mapbox://styles/mapbox/dark-v10",
      map: "",
    };
  },
  async created() {
    await this.$store.dispatch("earthquakes/fetchEarthquakes");
    this.initMap();

    if (this.isDataReceived) {
      console.log(this.getAllEarthquakeData);
      this.test(this.map);
    }
  },
  watch: {
    isDarkModeEnabled() {
      if (this.isDarkModeEnabled) {
        this.map.setStyle(this.darkMapStyle);
      } else {
        this.map.setStyle(this.lightMapStyle);
      }
    },
  },
  computed: {
    ...mapState("earthquakes", ["allEarthquakesInfo", "isDataReceived"]),
    ...mapGetters("earthquakes", ["getAllEarthquakeData"]),
  },
  methods: {
    ...mapMutations("earthquakes", ["fetchData"]),
    initMap() {
      mapboxgl.accessToken = this.accessToken;
      this.map = new mapboxgl.Map({
        container: "mapContainer",
        style: this.lightMapStyle,
        center: [37.870625, 38.867298],
        zoom: 5,
      });
    },
    testConsole() {
      console.log(this.getAllEarthquakeData);
    },
    changeMapStyle() {
      console.log("Style changed");
      this.isDarkModeEnabled = !this.isDarkModeEnabled;
    },
    test(map) {
      const size = 200;

      // This implements `StyleImageInterface`
      // to draw a pulsing dot icon on the map.
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.
        onAdd: function () {
          const canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext("2d");
        },

        // Call once before every frame where the icon will be used.
        render: function () {
          const duration = 1000;
          const t = (performance.now() % duration) / duration;

          const radius = (size / 2) * 0.3;
          const outerRadius = (size / 2) * 0.7 * t + radius;
          const context = this.context;

          // Draw the outer circle.
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
          context.fill();

          // Draw the inner circle.
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
          context.fillStyle = "rgba(255, 100, 100, 1)";
          context.strokeStyle = "white";
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();

          // Update this image's data with data from the canvas.
          this.data = context.getImageData(0, 0, this.width, this.height).data;

          // Continuously repaint the map, resulting
          // in the smooth animation of the dot.
          map.triggerRepaint();

          // Return `true` to let the map know that the image was updated.
          return true;
        },
      };

      map.on("load", () => {
        map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

        map.addSource("dot-point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [37.870625, 38.867298], // icon position [lng, lat]
                },
              },
            ],
          },
        });
        map.addLayer({
          id: "layer-with-pulsing-dot",
          type: "symbol",
          source: "dot-point",
          layout: {
            "icon-image": "pulsing-dot",
          },
        });
      });
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