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
        setEarthquakes(state, earthquakes) {
            state.allEarthquakesInfo = earthquakes
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