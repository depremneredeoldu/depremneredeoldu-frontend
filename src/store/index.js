import Vuex from "vuex";
import Vue from 'vue'
import { earthquakeStore } from "./modules/earthquakes"

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        earthquakes: earthquakeStore,
    }
});