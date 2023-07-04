import Config from "../config.js";
import Fixtures from "../../fixtures/fixtures.js";
import Axios from "axios";
import { axiosETAGCache } from "axios-etag-cache";
import MockAdapter from "axios-mock-adapter";
import { EventBus } from "./events";
import Store from "../store";

const NetMgrFactory = function (config) {
    return {
        token: null,
        mockAdapter: null,
        mocker: null,
        online: true,
        // this will, apparently, attach a magic etag/304 detector
        axiosInstance: axiosETAGCache(Axios.create(config)),
        /**
         * A function that works out if we really are Authenticated.
         * Rather than what the `Store.auth` actually claims.
         * @returns {boolean}
         */
        isAuth: function () {
            if (this.token) {
                const expiryTime =
                    this.token.requestTime + this.token.expires_in;
                return expiryTime > Math.floor(Date.now() / 1000);
            }
            return false;
        },
        /**
         * Sets the token data with real data, and preps transmission headers
         * @param tokenData
         */
        setToken: function (tokenData) {
            this.token = tokenData;

            if (this.token) {
                this.token.requestTime = Math.floor(Date.now() / 1000);
                this.axiosInstance.defaults.headers.common["Authorization"] =
                    "Bearer " + this.token.access_token;

                this.setLocalStorageFromToken(this.token);
            }
        },
        /**
         * Sets the access restriction headers
         * @param format
         */
        setAccept: function (format) {
            this.axiosInstance.defaults.headers.common["Accept"] = format;
        },
        /**
         * AXIOS get wrapper
         *
         * @param {string} route
         * @param {function} cb
         * @param {function} err
         */
        apiGet: function (route, cb, err) {
            console.log("apiGet", route);
            if (!route.match(/^\//)) {
                route = "/" + route;
            }
            this.axiosInstance
                .get(route)
                .then(cb)
                .catch(err || this.logAJAXErrors);
        },

        /**
         * AXIOS post wrapper;
         *
         * @param {string} route
         * @param postData
         * @param {function} cb
         * @param {function} err
         */
        apiPost: function (route, postData, cb, err) {
            console.log("apiPost", route);
            if (!route.match(/^\//)) {
                route = "/" + route;
            }
            this.axiosInstance
                .post(route, postData)
                .then(cb)
                .catch(err || this.logAJAXErrors);
        },

        /**
         * Default error handler, if one isn't provided to the api* ones.
         * @param error
         */
        logAJAXErrors: function (error) {
            if (error.response) {
                // non 2xx response
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            }
            console.log(error);
        },

        /**
         * Checks is Mocks are applied
         *
         * @returns {null}
         */
        isMocked: function () {
            return this.mocker;
        },

        /**
         * Sets up or restores a Mock Adapter
         */
        mockOn: function () {
            // if there's a mockAdapter add it back in.
            if (this.mockAdapter instanceof MockAdapter) {
                this.axiosInstance.defaults.adapter = this.mockAdapter;
                this.mocker = this.mockAdapter;
            } else {
                this.mocker = new MockAdapter(this.axiosInstance);
                Fixtures.apply(this.mocker);
            }
        },

        /**
         * Removes and stores Mock Adapter and restores original Axios instance it hides
         */
        mockOff: function () {
            if (this.isMocked()) {
                // save the current mock set
                this.mockAdapter = this.axiosInstance.defaults.adapter;
                // restore axios's previous adapter
                this.mocker.restore();
            }
            this.mocker = false;
        },

        /**
         * Sets the internal token variable to the result of the NetMgr.getTokenFromLocalStorage function.
         */
        setTokenFromLocalStorage: function () {
            const parsedLocalToken = this.getTokenFromLocalStorage();
            if (parsedLocalToken) {
                this.setToken(parsedLocalToken);
            }
        },

        /**
         * Retrieves the auth token object json from localStorage and attempts to parse the JSON string.
         * Returns the parsed token object or null if it is invalid JSON.
         * @returns {Object|null}
         */
        getTokenFromLocalStorage: function () {
            const localToken = localStorage["NetMgr.token"];
            let parsedLocalToken = null;

            try {
                parsedLocalToken = JSON.parse(localToken);
            } catch (e) {
                console.error("Invalid token stored in localstorage.");
            }

            return parsedLocalToken;
        },

        /**
         * Sets the provided token in localStorage.
         *
         * @param token
         *   The token to store in localStorage.
         */
        setLocalStorageFromToken: function (token) {
            localStorage["NetMgr.token"] = JSON.stringify(token);
        },
    };
};

let NetMgr = NetMgrFactory({
    baseURL: Config.apiBase,
    timeout: 20000,
    headers: {
        common: {
            "X-Requested-With": "XMLHttpRequest", // for laravel
        },
    },
});

/**
 * Sets the online status. Defaults to true if nothing is provided as a param.
 *
 * Only modifies the internal online variable if there is a difference.
 * Also, only fires the onlineStatusChange event if there is a difference.
 *
 * @param {boolean} [onlineStatus=true]
 *   Boolean indicating whether we are online or not.
 */
NetMgr.setOnlineStatus = function (onlineStatus = true) {
    const diff = onlineStatus !== this.online;
    if (diff) {
        this.online = onlineStatus;
        EventBus.$emit("NetMgr.onlineStatusChange", this.online);
    }
};

// Add interceptor to detect an expired access_token and refresh;
NetMgr.axiosInstance.interceptors.response.use(
    responseSuccessInterceptor,
    responseErrorInterceptor
);

function stash(response) {
    console.log("stash", response.data);
    if (Config.env !== "production" && Config.env !== "test") {
        // don't bother logging in we aren't live
        return;
    }
    response.created = Date.now();
    response.trader = Store.trader.id;
    const data = localStorage.getItem("arcLogs");
    const logs = data ? JSON.parse(data) : {};
    const json = JSON.stringify(response);
    const encoder = new TextEncoder();
    const plainText = encoder.encode(json);
    crypto.subtle.digest("SHA-256", plainText).then((hash) => {
        logs[
            Array.prototype.map
                .call(new Uint8Array(hash), (x) =>
                    ("00" + x.toString(16)).slice(-2)
                )
                .join("")
        ] = response;
        localStorage.setItem("arcLogs", JSON.stringify(logs));

        // We don't care if the logs send this time as they will be sent next time if they fail
        try {
            const token = JSON.parse(localStorage["NetMgr.token"]);
            // we're going to use fetch here to bypass thew axios handlers that trigger this function
            fetch(Config.apiBase + "/log", {
                body: JSON.stringify(logs),
                method: "PUT",
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                    "x-requested-with": "XMLHttpRequest",
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                    authorization: "Bearer " + token.access_token,
                },
            }).then((r) => {
                if (r.status === 200) {
                    r.json().then((json) => {
                        // TODO: abstract this, it's used above in this function too
                        const data = localStorage.getItem("arcLogs");
                        const logs = data ? JSON.parse(data) : {};
                        let val;
                        for (val of json) {
                            delete logs[val];
                        }
                        localStorage.setItem("arcLogs", JSON.stringify(logs));
                    });
                }
            });
        } catch (e) {
            console.error(
                "Can't log right now, invalid token stored in localstorage."
            );
        }
    });
}

/**
 * Handles successes and 202 errors.
 * @param origResponse
 * @returns {Promise<axios.AxiosResponse<any>|*>}
 */
async function responseSuccessInterceptor(origResponse) {
    stash(origResponse);
    // If the request was successfully completed, always set the online status to true.
    NetMgr.setOnlineStatus(true);
    if (origResponse.status !== 202) {
        // everything fine! return the response as-is
        return origResponse;
    } else {
        console.log("original response", origResponse);
        // there should be a location header and a retry-after
        const monitorUrl = origResponse.data["location"];
        const retryAfter = origResponse.data["retry-after"];
        // setup a special polling config
        const pollConfig = {
            baseURL: null, // we're going wherever the backend says.
            timeout: retryAfter * 5000, // in case of problems
            headers: {
                common: {
                    "X-Requested-With": "XMLHttpRequest", // for laravel
                },
            },
        };
        // make an axios instance with it
        const pollMgr = NetMgrFactory(pollConfig);
        // set the current token
        pollMgr.setTokenFromLocalStorage();
        // add the interceptors for _this_ set of calls...
        pollMgr.axiosInstance.interceptors.response.use(
            (response) => response,
            responseErrorInterceptor
        );
        let pollingResponse = await pollMgr.axiosInstance.get(monitorUrl);
        console.log("first...", pollingResponse);
        while (
            // if it says we're not finished/failed
            (pollingResponse.data.status !== "finished" ||
                pollingResponse.data.status !== "failed") &&
            // ... and we're being told to keep hitting the monitor
            pollingResponse.data.location === monitorUrl
        ) {
            // make subsequent hits.
            await new Promise((resolve) => {
                setTimeout(resolve, retryAfter * 1000);
            });
            pollingResponse = await pollMgr.axiosInstance.get(monitorUrl);
            console.log("Operation status", pollingResponse);
        }

        const { status } = pollingResponse.data;
        switch (status) {
            case "failed":
                // TODO: set promise rejected.
                console.log("failed");
                return pollingResponse;
            case "finished":
                console.log("Operation succeeded, fetching!");
                return await pollMgr.axiosInstance.get(
                    pollingResponse.data.location
                );
            default:
                console.log("Operation halted unusually");
                return pollingResponse;
        }
    }
}

/**
 * Interceptor Handles errors
 * @param error
 * @returns {Promise<never>|void}
 */
function responseErrorInterceptor(error) {
    stash(error);
    // Get the original request configuration.
    const origCfg = error.config;

    // Get the error from that request.
    const origResp = error.response;

    // Grab the error message.
    const errMsg = error.message || null;

    // Default to assuming we are online.
    // Set offline if a Network Error occurs.
    NetMgr.setOnlineStatus(errMsg !== "Network Error");

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

                const lsToken =
                    NetMgr.getTokenFromLocalStorage() || NetMgr.token;

                // Let's hit the refresh with the refresh token
                // Passport is returning the tokens in "data.original" on this endpoint. Odd.
                return NetMgr.apiPost(
                    "/login/refresh",
                    { refresh_token: lsToken.refresh_token },
                    (refreshData) => {
                        const newTokenData = refreshData.data.original || null;

                        if (newTokenData) {
                            NetMgr.setToken(newTokenData); // Set the token.
                            // Valid refresh_token, reset and retry.
                            return NetMgr.axiosInstance(origCfg); // Retry the request that errored out.
                        } else {
                            NetMgr.setToken(null);
                            EventBus.$emit("NetMgr.logout", 401);
                        }
                    },
                    (refreshErr) => {
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

// set cookie in devtools to enable mocks in development skipping the local API
// document.cookie = "arcv_use_mocks=true;max-age=" + 86400*30;
if (Config.useMocks) {
    NetMgr.mockOn();
}

export default NetMgr;
