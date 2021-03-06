import Config from "../config.js";
import Fixtures from "../../fixtures/fixtures.js";
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { EventBus } from "./events";

// TODO: refactor into submodules for Auth, Axios and Mocks
// TODO: have store listen for auth changes

let NetMgr = {
    token: null,
    mockAdapter: null,
    mocker: null,
    online: true,
    axiosInstance: Axios.create({
        baseURL: Config.apiBase,
        timeout: 10000,
        headers: {
            common: {
                "X-Requested-With": "XMLHttpRequest", // for laravel
            },
        },
    }),
};

/**
 * A function that works out if we really are Authenticated.
 * Rather than what the Store.auth actually claims.
 *
 * @returns {boolean}
 */
NetMgr.isAuth = function () {
    if (this.token) {
        const expiryTime = this.token.requestTime + this.token.expires_in;
        if (expiryTime > Math.floor(Date.now() / 1000)) {
            return true;
        }
    }
    return false;
};

/**
 * Sets the token data with real data, and preps transmission headers
 *
 * @param tokenData
 */
NetMgr.setToken = function (tokenData) {
    this.token = tokenData;

    if (this.token) {
        this.token.requestTime = Math.floor(Date.now() / 1000);
        this.axiosInstance.defaults.headers.common["Authorization"] =
            "Bearer " + this.token.access_token;

        this.setLocalStorageFromToken(this.token);
    }
};

/**
 * Sets the access restriction headers
 *
 * @param format
 */
NetMgr.setAccept = function (format) {
    this.axiosInstance.defaults.headers.common["Accept"] = format;
};

/**
 * AXIOS get wrapper
 *
 * @param route
 * @param cb
 * @param err
 * @returns {Promise.<TResult>}
 */
NetMgr.apiGet = function (route, cb, err) {
    if (!route.match(/^\//)) {
        route = "/" + route;
    }
    return this.axiosInstance
        .get(route)
        .then(cb)
        .catch(err || this.logAJAXErrors);
};

/**
 * AXIOS post wrapper;
 *
 * @param route
 * @param postData
 * @param cb
 * @param err
 * @returns {Promise.<TResult>}
 */
NetMgr.apiPost = function (route, postData, cb, err) {
    if (!route.match(/^\//)) {
        route = "/" + route;
    }
    return this.axiosInstance
        .post(route, postData)
        .then(cb)
        .catch(err || this.logAJAXErrors);
};

/**
 * Default error handler, if one isn't provided to the api* ones.
 * @param error
 */
NetMgr.logAJAXErrors = function (error) {
    if (error.response) {
        // non 2xx response
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        console.log(error.request);
    } else {
        // catchall
        console.log("Error", error.message);
    }
    console.log(error.config);
};

/**
 * Checks is Mocks are applied
 *
 * @returns {null}
 */
NetMgr.isMocked = function () {
    // TODO: make tis more effective
    return this.mocker;
};

/**
 * Sets up or restores a Mock Adapter
 */
NetMgr.mockOn = function () {
    // if there's a mockAdapter add it back in.
    if (this.mockAdapter instanceof MockAdapter) {
        this.axiosInstance.defaults.adapter = this.mockAdapter;
        this.mocker = this.mockAdapter;
    } else {
        this.mocker = new MockAdapter(this.axiosInstance);
        Fixtures.apply(this.mocker);
    }
};

/**
 * Removes and stores Mock Adapter and restores original Axios instance it hides
 */
NetMgr.mockOff = function () {
    if (this.isMocked()) {
        // save the current mock set
        this.mockAdapter = this.axiosInstance.defaults.adapter;
        // restore axios's previous adapter
        this.mocker.restore();
    }
    this.mocker = false;
};

// set cookie in devtools to ignore mocks in development and connect directly to local API
// document.cookie = "arcv_ignore_mocks=true;max-age=" + 86400*30;
if (
    Config.env === "development" &&
    document.cookie.indexOf("arcv_ignore_mocks=true") === -1
) {
    NetMgr.mockOn();
}

/**
 * Sets the internal token variable to the result of the NetMgr.getTokenFromLocalStorage function.
 */
NetMgr.setTokenFromLocalStorage = function () {
    let parsedLocalToken = this.getTokenFromLocalStorage();

    if (parsedLocalToken) {
        this.setToken(parsedLocalToken);
    }
};

/**
 * Retrieves the auth token object json from localStorage and attempts to parse the JSON string.
 *
 * @returns {Object|null}
 *   Returns the parsed token object or null if it is invalid JSON.
 */
NetMgr.getTokenFromLocalStorage = function () {
    let localToken = localStorage["NetMgr.token"];
    let parsedLocalToken = null;

    try {
        parsedLocalToken = JSON.parse(localToken);
    } catch (e) {
        console.error("Invalid token stored in localstorage.");
    }

    return parsedLocalToken;
};

/**
 * Sets the online status. Defaults to true if nothing is provided as a param.
 *
 * Only modifies the internal online variable if there is a difference.
 * Also only fires the onlineStatusChange event if there is a difference.
 *
 * @param onlineStatus
 *   Boolean indicating whether we are online or not.
 */
NetMgr.setOnlineStatus = function (onlineStatus = true) {
    let diff = onlineStatus !== this.online;

    if (diff) {
        this.online = onlineStatus;
        EventBus.$emit("NetMgr.onlineStatusChange", this.online);
    }
};

/**
 * Sets the provided token in localStorage.
 *
 * @param token
 *   The token to store in localStorage.
 */
NetMgr.setLocalStorageFromToken = function (token) {
    localStorage["NetMgr.token"] = JSON.stringify(token);
};

// Add interceptor to detect an expired access_token and refresh;
NetMgr.axiosInstance.interceptors.response.use(
    function (response) {
        // If the request was successfully completed set the online status to true.
        NetMgr.setOnlineStatus(true);

        // everything fine! return the response to apiGet/apiPost
        return response;
    },
    function (error) {
        // Get the original request configuration.
        const origCfg = error.config;

        // Get the error from that request.
        const origResp = error.response;

        // Grab the error message.
        const errMsg = error.message || null;

        // Default to assuming we are online.
        NetMgr.setOnlineStatus(true);

        // Set offline if a Network Error occurs. There should be a more specific error message but I couldn't find one.
        if (errMsg === "Network Error") {
            NetMgr.setOnlineStatus(false);
        }

        // is it a 403? User tried something bad, broadcast a Logout event, someone will deal.
        if (origResp.status === 403) {
            NetMgr.setToken(null);
            EventBus.$emit("NetMgr.logout", 403);
        }

        // Is it a 401 we have not seen before? (and do we have an old token set)
        if (origResp.status === 401 && !origCfg._retry && NetMgr.token) {
            switch (origResp.data.error) {
                case "invalid_token": // oAuth2 token invalid.
                case "Unauthenticated.": // User not logged on.
                    origCfg._retry = true; // Set so we don't hit this one again.

                    let lsToken =
                        NetMgr.getTokenFromLocalStorage() || NetMgr.token;

                    // Let's hit the refresh with the refresh token
                    // Passport is returning the tokens in "data.original" on this endpoint. Odd.
                    return NetMgr.apiPost(
                        "/login/refresh",
                        { refresh_token: lsToken.refresh_token },
                        function (refreshData) {
                            let newTokenData =
                                refreshData.data.original || null;

                            if (newTokenData) {
                                NetMgr.setToken(newTokenData); // Set the token.
                                // Valid refresh_token, reset and retry.
                                return NetMgr.axiosInstance(origCfg); // Retry the request that errored out.
                            } else {
                                NetMgr.setToken(null);
                                EventBus.$emit("NetMgr.logout", 401);
                            }
                        },
                        function (refreshErr) {
                            // Invalid refresh token, pass that back as a failure, so someone else deals with it.
                            return Promise.reject(refreshErr);
                        }
                    );
                default:
                // Fall through...
            }
        }

        // So all other errors returned to api get/post.
        return Promise.reject(error);
    }
);

export default NetMgr;
