// Import Offline-Plugin storage client
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
// Enable caching now.
OfflinePluginRuntime.install();

import Vue from 'vue';
import App from './App.vue';
import Config from './config.js';
import Store from './store.js';
import VueRouter from 'vue-router';
import { EventBus } from './services/events';

Vue.use(VueRouter);

// Import pages
import Account from './pages/Account.vue';
import Tap from './pages/Tap.vue';
import Scan from './pages/Scan.vue';
import Payment from './pages/Payment.vue';
import Login from './pages/Login.vue';
import Request from './pages/Request.vue';
import ChangePassword from './pages/ChangePassword.vue';
import User from './pages/User.vue';
import Privacy from './pages/Privacy.vue';

console.info(BUILDDATE + '\n' + BRANCH + '\n' + VERSION);

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
    { path: '/payment', component: Payment, meta: { auth: true }  },
    { path: '/login', component: Login, meta: { auth: false }  },
    { path: '/request', component: Request, meta: { auth: false }  },
    { path: '/change-password', component: ChangePassword, meta: { auth: false } },
    { path: '/user', component: User, meta: { auth : true } },
    { path: '/privacy-policy', component: Privacy, meta: { auth : false } },
    { path: '*', redirect : "/" }
];

// Create the router instance and pass the 'routes' option.
// NB - the base param should cope with the app route being a subdirectory.
const router = new VueRouter({
    routes,
    mode: 'history',
    base: window.location.pathname.
    // Split it up into path components
        split('/').
    // Chop the last one off, there may only be one
        slice(0, -1).
    // Rejoin the remainder (if any) and tap "/" on the back.
        join('/')+'/'
});

// Nasty hack to get round the new NavigationErrors
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(
    location,
    onResolve,
    onReject
) {
    console.log("running error")
    if (onResolve || onReject) {
        return originalPush.call(this, location, onResolve, onReject);
    }
    return originalPush.call(this, location).catch(
        function(e) {
        if (VueRouter.isNavigationFailure(e)) {
            // resolve err
            return e;
        }
        // rethrow error
        return Promise.reject(e)
    })
}

// Route Guard rules for directing users
router.beforeEach(function (to, from, next) {
    const auth = Store.netMgr.isAuth();

    if (auth) {
        // authenticated
        if (!Store.trader.id && to.path !== "/user") {
            // ... no trader and not picking one? go to the trader chooser next
            // with a redirect for onward travel
            next({
                path: '/user',
                query: {redirect: to.path}
            });
            return;
        }
        if (!to.meta.auth) {
            // ... but heading to an unguarded page?
            // go to root.
            next({ path: '/'});
            return;
        }
    } else {
        // not authenticated
        if (to.meta.auth) {
            // ... and accessing auth-guarded page
            // clear your session
            Store.netMgr.setTokenFromLocalStorage();
            Store.setUserTradersFromLocalStorage();
            // and go to login to try again.
            // before going back to that page you wanted
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            });
            return;
        }
    }
    // business as usual, don't intercept the route, just move along
    next();
});

// The routing isn't foolproof; EG if the "back" button is hammered - this tries to catch that *after* transition.
router.afterEach(function(transition){
    var auth = Store.netMgr.isAuth();
    Store.error = null;
    if (!auth && transition.meta.auth) {
        this.go('/');
    }
}.bind(router));

var vm = new Vue({
    el: '#app',
    // h is an alias to createElement
    render: function(h) { return h(App) },
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

/**
 * Reset all stored information and redirect the user back to the login page when 'NetMgr.logout' is fired.
 *
 * @param err
 *   Logout reason.
 */
EventBus.$on('NetMgr.logout', function(err) {
    Store.resetStore();
    router.push('login');
});
