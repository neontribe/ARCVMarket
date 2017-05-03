import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import Config from './config.js';
import Store from './store.js';

window.Store = Store;

Vue.use(VueAxios, axios);

var vm = new Vue({
    el: '#app',
    render: h => h(App), // I don't like this; feels like witch-craft! Setup the wrong way?
    mounted: function() {
        // runs when app "ready";
        Store.config = Config;
        console.log(Store);
    },
    watch: {
    },
    methods : {
    },

});

