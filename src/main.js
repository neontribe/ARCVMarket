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

/*
route access rules
auth -> true, user MUST be auth'd - friends only
auth -> false, user MUST NOT be auth'd - stranger's only
auth -> undefined, auth not important - public
*/

// Define routes
const routes = [
    { path: '/', component: Tap, meta: { auth: true } },
    { path: '/account', component: Account, meta: { auth: true }  },
    { path: '/scan', component: Scan, meta: { auth: true }  },
    { path: '/upload', component: Upload, meta: { auth: true }  },
    { path: '/payment', component: Payment, meta: { auth: true }  },
    { path: '/login', component: Login, meta: { auth: false }  },
    { path: '/user', component: User, meta: { auth : true } },
    { path: '*', redirect : "/" }
];

// Create the router instance and pass the 'routes' option
const router = new VueRouter({
    routes,
    mode: 'history',
    base: '/'
});

// Route Guard rules for directing users
router.beforeEach((to, from, next) => {
    var auth = Store.netMgr.isAuth();
    if (!auth && to.meta.auth) {
        // not auth'd, accessing friends-only page, go to /login
        next({
            path: '/login',
            query: {redirect: to.fullPath}
        });
    } else if (auth) {
        if (!Store.trader.id && to.path != "/user") {
            // No trader and have optiosn? We need to go to the trader chooser next, then on to where-ever.
            // "Wherever" will be dealt with *after* that page.
            next({
                path: '/user',
                query: {redirect: to.path}
            });
        }
        if (!to.meta.auth) {
            // auth'd, trader'd but strangers-only page? Nope, go to '/'
            next('/');
        }
    }
    // public || auth'd, trader'd+friends-only || unauth'd+strangers-only, go where they asked;
    next();
});

// The routing isn't foolproof; EG if the "back" button is hammered - this tries to catch that *after* transition.
router.afterEach(function(transition){
    var auth = Store.netMgr.isAuth();
    if (!auth && transition.meta.auth) {
        this.go('/');
    }
}.bind(router));

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
