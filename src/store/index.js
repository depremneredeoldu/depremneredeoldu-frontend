import Vuex from "vuex";
import Vue from 'vue'
import { earthquakeStore } from "./modules/earthquakes"
import { mapStore } from "./modules/map";

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        earthquakes: earthquakeStore,
        map: mapStore,
    }
});