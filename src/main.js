/* Copyright (c) 2017, Alexander Rose Charity (reg. in England and Wales, #00279157) */
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
    render: h => h(App), // TODO: Make sure this builds down to ES5
    data : function() {
        return {
        }
    },
    mounted: function() {
        // runs when app "ready";
        Store.config = Config;
    },
    watch: {
    },
    methods : {

    },

});

