import mapboxgl from "mapbox-gl";


const initState = () => {
    return {
        mapAccessToken: process.env.VUE_APP_MAP_API_KEY,
        isDarkModeEnabled: false,
        centerCoordinate: [37.870625, 38.867298],
        mapZoomLevel: 5,
        lightMapStyle: "mapbox://styles/mapbox/streets-v11",
        darkMapStyle: "mapbox://styles/alicanyuksel/ckf7kg2t70iah19np73mhnx48",
        map: "",
    }
}


export const mapStore = {
    namespaced: true,
    state: initState(),
    mutations: {
        initMap(state) {
            mapboxgl.accessToken = state.mapAccessToken;
            state.map = new mapboxgl.Map({
                container: "mapContainer",
                style: state.darkMapStyle,
                center: state.centerCoordinate,
                zoom: state.mapZoomLevel,
            });
        },
        addPulsingDot(state, payload) {
            state.map.on("load", () => {
                state.map.addImage(payload.pulsingDotName, payload.pulsingDot, { pixelRatio: 5 });

                state.map.addSource(payload.sourceName, {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: payload.features,
                    },
                });
                state.map.addLayer({
                    id: payload.layerId,
                    type: "symbol",
                    source: payload.sourceName,
                    layout: {
                        "icon-image": payload.pulsingDotName,
                    },
                });
            });

            state.map.on("click", payload.layerId, function (e) {
                state.map.flyTo({
                    center: e.features[0].geometry.coordinates,
                    zoom: 8,
                });
            });

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            });

            state.map.on("mouseenter", payload.layerId, function (e) {
                state.map.getCanvas().style.cursor = "pointer";

                var coordinates = e.features[0].geometry.coordinates.slice();
                var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates).setHTML(description).addTo(state.map);
            });

            state.map.on("mouseleave", payload.layerId, function () {
                state.map.getCanvas().style.cursor = "";
                popup.remove();
            });
        },
        setMapStyle(state) {
            if (state.isDarkModeEnabled) {
                state.map.setSyle(state.darkMapStyle)
            }
            state.map.setStyle(state.lightMapStyle)
        }

    },
    getters: {
        getMapObject(state) {
            return state.map;
        },
        getPulsingDot(state) {
            return (pulsingDotColor) => {
                const size = 200;
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

                        var radius = (size / 2) * 0.3;
                        var outerRadius = (size / 2) * 0.7 * t + radius;
                        var context = this.context;

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
                        context.fillStyle = pulsingDotColor.circleColor;
                        context.fill();

                        // Draw the inner circle.
                        context.beginPath();
                        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                        context.fillStyle = pulsingDotColor.backgroundColor;
                        context.strokeStyle = "white";
                        context.lineWidth = 2 + 4 * (1 - t);
                        context.fill();
                        context.stroke();

                        // Update this image's data with data from the canvas.
                        this.data = context.getImageData(0, 0, this.width, this.height).data;

                        // Continuously repaint the map, resulting
                        // in the smooth animation of the dot.
                        state.map.triggerRepaint();

                        // Return `true` to let the map know that the image was updated.
                        return true;
                    }
                }
                return pulsingDot
            }
        }
    }
}