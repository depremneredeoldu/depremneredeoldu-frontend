import axios from "axios";

const initState = () => {
    return {
        allEarthquakesInfo: [],
        isDataReceived: false,
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