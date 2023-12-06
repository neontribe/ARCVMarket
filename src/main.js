// Import Offline-Plugin storage client
import * as OfflinePluginRuntime from "@lcdp/offline-plugin/runtime";
import Vue from "vue";
import App from "./App.vue";
import Config from "./config.js";
import Store from "./store.js";
import VueRouter from "vue-router";
import { EventBus } from "./services/events";
// Import pages
import Account from "./components/Account.vue";
import Tap from "./pages/Tap.vue";
import Scan from "./pages/Scan.vue";
import Payment from "./pages/Payment.vue";
import Login from "./pages/Login.vue";
import Request from "./pages/Request.vue";
import ChangePassword from "./pages/ChangePassword.vue";
import User from "./pages/User.vue";
import constants from "./constants";
import pjson from "../package.json";

// Enable caching when not developing  to avoid webpack hot-reload problems.
// see webpack,config.js
if (process.env.NODE_ENV !== "development") {
    OfflinePluginRuntime.install({
        onInstalled: function () {
            console.log("App is ready for offline usage");
        },
        onUpdating: function () {
            console.log("SW Event:", "onUpdating");
        },
        onUpdateReady: function () {
            console.log("SW Event:", "onUpdateReady");
            // Tells to new SW to take control immediately
            OfflinePluginRuntime.applyUpdate();
        },
        onUpdated: function () {
            console.log("SW Event:", "onUpdated");
            // Reload the webpage to load into the new version
            window.location.reload();
        },
        onUpdateFailed: function () {
            console.log("SW Event:", "onUpdateFailed");
        },
    });
} else {
    console.log("SPA refresh disabled for dev mode");
}
Vue.use(VueRouter);

console.info(
    "Build date: " +
        BUILDDATE +
        "\nBranch: " +
        BRANCH +
        "\nGit commit: " +
        VERSION
);
console.log("Package Version", pjson.version);
/*
 route access rules
 auth -> true, user MUST be authenticated - friends only
 auth -> false, user MUST NOT be authenticated - stranger's only
 auth -> undefined, auth not important - public
 */

// Define routes
const routes = [
    {
        path: "/",
        component: Tap,
        meta: { auth: true },
        beforeEnter: function (to, from, next) {
            if (Store.trader.hasOwnProperty("featureOverride")) {
                const { tap } = Store.trader.featureOverride.pageAccess;
                if (tap === false) {
                    next({ path: "/scan" });
                } else {
                    next();
                }
            } else {
                next();
            }
        },
    },
    { path: "/account", component: Account, meta: { auth: true } },
    { path: "/scan", component: Scan, meta: { auth: true } },
    { path: "/payment", component: Payment, meta: { auth: true } },
    {
        path: "/login",
        name: "login",
        component: Login,
        meta: { auth: false },
        props: true,
    },
    { path: "/request", component: Request, meta: { auth: false } },
    {
        path: "/change-password",
        component: ChangePassword,
        meta: { auth: false },
    },
    { path: "/user", component: User, meta: { auth: true } },
    { path: "*", redirect: "/" },
];

// Create the router instance and pass the 'routes' option.
// NB - the base param should cope with the app route being a subdirectory.
const router = new VueRouter({
    routes,
    mode: "history",
    base:
        window.location.pathname
            // Split it up into path components
            .split("/")
            // Chop the last one off, there may only be one
            .slice(0, -1)
            // Rejoin the remainder (if any) and tap "/" on the back.
            .join("/") + "/",
});

// Nasty hack to get round the new NavigationErrors
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) {
        return originalPush.call(this, location, onResolve, onReject);
    }
    return originalPush.call(this, location).catch(function (e) {
        if (VueRouter.isNavigationFailure(e)) {
            // resolve err
            return e;
        }
        // rethrow error
        return Promise.reject(e);
    });
};

// Route Guard rules for directing users
router.beforeEach(function (to, from, next) {
    const auth = Store.netMgr.isAuth();

    if (auth) {
        // authenticated
        if (!Store.trader.id && to.path !== "/user") {
            // ... no trader and not picking one? go to the trader chooser next
            // with a redirect for onward travel
            next({
                path: "/user",
                query: { redirect: to.path },
            });
            return;
        }
        if (!to.meta.auth) {
            // ... but heading to an unguarded page?
            // go to root.
            next({ path: "/" });
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
                path: "/login",
                query: { redirect: to.fullPath },
            });
            return;
        }
    }
    // business as usual, don't intercept the route, just move along
    next();
});

// The routing isn't foolproof; EG if the "back" button is hammered - this tries to catch that *after* transition.
router.afterEach(
    function (transition) {
        const auth = Store.netMgr.isAuth();
        Store.error = null;
        if (!auth && transition.meta.auth) {
            this.go("/");
        }
    }.bind(router)
);

let vm = new Vue({
    el: "#app",
    // h is an alias to createElement
    render: function (h) {
        return h(App);
    },
    data: function () {
        return {};
    },
    mounted: function () {
        // Runs when app "ready";
        Store.config = Config;
    },
    watch: {},
    methods: {},
    // Pass the template to the root component
    template: "<App/>",
    components: { App },
    // Pass in the router to the Vue instance
    router,
}).$mount("#app"); // Mount the router on the app

/**
 * Reset all stored information and redirect the user back to the login page when 'NetMgr.logout' is fired.
 */
EventBus.$on("NetMgr.logout", function (statusCode = null) {
    Store.resetStore();

    // Setup the route object
    let routeObj = { name: "login" };
    // Shall we prep a message for the login page
    if (statusCode) {
        let message = {};
        switch (statusCode) {
            // Refresh token failed
            case 401:
                message.text = constants.copy.TIMEOUT_LOGOUT;
                message.state = constants.MESSAGE_WARNING;
                break;
            // Access forbidden, Trader probably disabled for that User
            case 403:
                message.text = constants.copy.FORCED_LOGOUT;
                message.state = constants.MESSAGE_WARNING;
                break;
            default:
                message.text = constants.copy.UNKNOWN_EVENT;
                message.state = constants.MESSAGE_ERROR;
        }
        routeObj.params = { passedMessage: message };
    }
    router.push(routeObj);
});
