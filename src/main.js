/* Copyright (c) 2017, Alexander Rose Charity (reg. in England and Wales, #00279157) */
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import Config from './config.js';
import Store from './store.js';
import VueRouter from 'vue-router';
Vue.use(VueRouter)

// Import components
import Home from './components/Home.vue'
import Tap from './components/Tap.vue'
import Scan from './components/Scan.vue'
import Send from './components/Send.vue'
import Login from './components/Login.vue'

// Define routes
const routes = [
{ path: '/', component: Home },
{ path: '/tap', component: Tap },
{ path: '/scan', component: Scan },
{ path: '/send', component: Send },
{ path: '/login', component: Login }
]

// Create the router instance and pass the 'routes' option
const router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history'
})

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
        // Runs when app "ready";
        Store.config = Config;
    },
    watch: {
    },
    methods : {
    },
    // Pass the template to the root component
    template: '<App/>',
    components: { App },
    // Pass in the router to the Vue instance
    router
}).$mount('#app') // Mount the router on the app
