import Vue from 'vue';
import App from './App.vue';
import Config from './config.js';
import Store from './store.js';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// Import pages
import Account from './pages/Account.vue';
import Tap from './pages/Tap.vue';
import Scan from './pages/Scan.vue';
import Upload from './pages/Upload.vue';
import Payment from './pages/Payment.vue';
import Login from './pages/Login.vue';
import User from './pages/User.vue';

// Import components
// import Masthead from './components/Masthead.vue';
// import Logo from './components/Logo.vue';
// import Instructions from './components/Instructions.vue';

// Define routes
const routes = [
    { path: '/', component: Tap, meta: { auth: true } },
    { path: '/account', component: Account, meta: { auth: true }  },
    { path: '/tap', component: Tap, meta: { auth: true }  },
    { path: '/scan', component: Scan, meta: { auth: true }  },
    { path: '/upload', component: Upload, meta: { auth: true }  },
    { path: '/payment', component: Payment, meta: { auth: true }  },
    { path: '/login', component: Login, meta: { auth: false }  },
    { path: '/user', component: User },
    { path: '*', redirect : "/" }
];

// Create the router instance and pass the 'routes' option
const router = new VueRouter({
    routes, // short for routes: routes
    mode: 'history',
    base: '/'
});

// Route Guard rules for directing users
router.beforeEach((to, from, next) => {
    var auth = Store.netMgr.isAuth();
    if (!auth && to.meta.auth) {
        next({
            path: '/login',
            query: {redirect: to.fullPath} // TODO : redirect for deep logins
        });
    } else if (auth && !to.meta.auth)  {
        console.log("hello");
        next('/tap'); // if logged in, default to tap for guest-only routes
    } else {
        next(); // just do the link
    }
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
