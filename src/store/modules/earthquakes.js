import axios from "axios";

const initState = () => {
    return {
        allEarthquakesInfo: [],
        isDataReceived: false,
        allEarthquakeFeatures: [],
        allGreenEarthquakeFeatures: [],
        allYellowEarthquakeFeatures: [],
        allRedEarthquakeFeatures: [],
        greenEarthquakeColor: { backgroundColor: "rgba(77, 175, 124, 1)", circleColor: "rgba(77, 175, 124, 0.2)" },
        yellowEarthquakeColor: { backgroundColor: "rgba(247, 202, 24, 1)", circleColor: "rgba(247, 202, 24, 0.2)" },
        redEarthquakeColor: { backgroundColor: "rgba(255, 100, 100, 1)", circleColor: "rgba(255, 100, 100, 0.2)" },
    }
}


export const earthquakeStore = {
    namespaced: true,
    state: initState(),
    mutations: {
        saveEarthquakes(state, earthquakes) {
            for (const eachEarthquake of earthquakes) {
                const earthquakeObject = new Earthquake(
                    eachEarthquake.earthquake_id,
                    eachEarthquake.date,
                    eachEarthquake.time,
                    eachEarthquake.latitude,
                    eachEarthquake.longitude,
                    eachEarthquake.depth,
                    eachEarthquake.magnitude,
                    eachEarthquake.location
                );
                state.allEarthquakesInfo.push(earthquakeObject);
            }
        },
        setDataReceived(state, value) {
            state.isDataReceived = value
        },
    },
    actions: {
        fetchEarthquakes({ commit }) {
            return axios.get(process.env.VUE_APP_EARTHQUAKE_API_URL)
                .then(response => {
                    commit('setEarthquakes', response.data.earthquakes)
                    commit('setDataReceived', true)
                }).catch(err => {
                    console.log(err);
                })
        }
    },
    getters: {
        getAllEarthquakeData(state) {
            return state.allEarthquakesInfo;
        }
    }
}