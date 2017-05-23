import Vue from 'vue';
import App from './App.vue';
import Config from './config.js';
import Store from './store.js';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// Import pages
import Account from './pages/Account.vue'
import Tap from './pages/Tap.vue'
import Payment from './pages/Payment.vue'
import Login from './pages/Login.vue'
import User from './pages/User.vue'

// Import components
import Masthead from './components/Masthead.vue'
import Logo from './components/Logo.vue'
import Instructions from './components/Instructions.vue'

// Define routes
const routes = [
    {path: '/account', component: Account},
    {path: '/tap', component: Tap},
    {path: '/payment', component: Payment},
    {path: '/', component: Login},
    {path: '/login', component: Login},
    {path: '/user', component: User}
];

// Create the router instance and pass the 'routes' option.
const router = new VueRouter({
    routes, // Short for routes: routes.
    mode: 'history'
});

var vm = new Vue({
    el: '#app',
    render: h => h(App), // TODO: Make sure this builds down to ES5
    data: function () {
        return {}
    },
    mounted: function () {
        // Runs when app "ready";
        Store.config = Config;
    },
    watch: {},
    methods: {},
    // Pass the template to the root component
    template: '<App/>',
    components: {App},
    // Pass in the router to the Vue instance
    router
}).$mount('#app'); // Mount the router on the app
