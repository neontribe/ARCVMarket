import Config from '../config.js';
import Fixtures from '../../fixtures/fixtures.js';
import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
/*
 NetMgr is a place to put all the
 - AJAX axios stuff;
 - Mock binding
 - Authentication

 Though, in theory it could have been split into a series of modules.

 - event bus
 - move authentication to netmgr
 - have store listen for auth changes
 - implement auth changes
 - settimeout on tokenset! (first or subsequent)

 */


var NetMgr = {
    token: null,
    mockAdapter: null,
    mocker: null,
    tokenRefreshTimeoutID: null,
    axiosInstance: Axios.create({
        baseURL: Config.apiBase,
        timeout: 10000,
        headers: {
            common: {
                'X-Requested-With': 'XMLHttpRequest', // for laravel
            }
        }
    })
};

/**
 * A function that works out if we really are Authenticated.
 * Rather than what the Store.auth actually claims.
 *
 * @returns {boolean}
 */
NetMgr.isAuth = function() {
    if (this.token) {
        var expiryTime = this.token.requestTime + this.token.expires_in;
        if (expiryTime > Math.floor(Date.now()/1000)) {
            return true;
        }
    }
    return false;
};

NetMgr.setTokenFromLocalStorage = function() {
    let parsedLocalToken = this.getTokenFromLocalStorage();

    this.setToken(parsedLocalToken);
};

NetMgr.getTokenFromLocalStorage = function() {
    let localToken = localStorage['NetMgr.token'];
    let parsedLocalToken = null;

    try {
        parsedLocalToken = JSON.parse(localToken);
    } catch (e) {
        console.error('Invalid token stored in localstorage.');
    }

    return parsedLocalToken;
};

NetMgr.setLocalStorageFromToken = function(token) {
    localStorage['NetMgr.token'] = JSON.stringify(token);
};

NetMgr.setTokenRefreshTimeout = function(timeout, token) {
    // Setup a new token refresh timeout.
    this.tokenRefreshTimeoutID = setTimeout(
        () => {
            //Passport is returning the tokens in "data.orginal" on this endpoint. Odd.
            NetMgr.apiPost('/login/refresh', { refresh_token: this.token.refresh_token },
                function (refreshData) {
                    let newTokenData = refreshData.data.original;

                    if(newTokenData) {
                        // Valid refresh_token, reset and retry.
                        NetMgr.setToken(newTokenData); // Set the token.
                    }
                },
                function (refreshErr) {// Invalid refresh token, pass that back as a failure, so someone else deals with it.
                    return Promise.reject(refreshErr);
                });
        },
        timeout
    );
};

/**
 * Clears the current token refresh timeout.
 */
NetMgr.clearTokenRefreshTimeout = function() {
    window.clearTimeout(this.tokenRefreshTimeoutID);
};

/**
 * Sets the token data with real data, and preps transmission headers
 *
 * @param tokenData
 */
NetMgr.setToken = function (tokenData) {
    this.token = tokenData;

    // Clear the current timeout.
    this.clearTokenRefreshTimeout();

    if (this.token) {
        this.token.requestTime = Math.floor(Date.now() / 1000);
        this.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + this.token.access_token;

        this.setLocalStorageFromToken(this.token);

        // Get the time in ms until the token expires minus five seconds to allow the network request to go through.
        let timeoutTime = this.token.expires_in * 1000 - 5000;
        this.setTokenRefreshTimeout(timeoutTime)
    }
};

/**
 * Sets the access restriction headers
 *
 * @param format
 */
NetMgr.setAccept = function (format) {
    this.axiosInstance.defaults.headers.common['Accept'] = format;
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
        route = '/' + route;
    }
    return this.axiosInstance.get(route)
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
        route = '/' + route;
    }
    return this.axiosInstance.post(route, postData)
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
        console.log('Error', error.message);
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
if (Config.env === "development" && ( document.cookie.indexOf("arcv_ignore_mocks=true") === -1 )) {
    NetMgr.mockOn();
}

// Add interceptor to detect an expired access_token and refresh;
NetMgr.axiosInstance.interceptors.response.use(
    function (response) {
        // everything fine! return the response to apiGet/apiPost
        return response;
    },
    function (error) {
        // Get the original request configuration.
        var origCfg = error.config;

        // Get the error from that request.
        var origResp = error.response;

        // Is it a 401 we havn't seen before? (and do we have an old token set)
        if (origResp.status === 401 && !origCfg._retry && NetMgr.token) {
            switch (origResp.data.error) {
                case "invalid_token"    : // oAuth2 token invalid.
                // case "Unauthorized"     : // Logged in BUT denied resource.
                case "Unauthenticated." : // User not logged on.
                    origCfg._retry = true; // Set so we don't hit this one again.

                    let lsToken = NetMgr.getTokenFromLocalStorage() || NetMgr.token;

                    // Let's hit the refresh with the refresh token
                    //Passport is returning the tokens in "data.orginal" on this endpoint. Odd.
                    return NetMgr.apiPost('/login/refresh', { refresh_token: lsToken.refresh_token },
                        function (refreshData) {
                            let newTokenData = refreshData.data.original || null;

                            if(newTokenData) {
                                NetMgr.setToken(newTokenData); // Set the token.
                                // Valid refresh_token, reset and retry.
                                return NetMgr.axiosInstance(origCfg) // Retry the request that errored out.
                            }
                        },
                        function (refreshErr) {

                            // Invalid refresh token, pass that back as a failure, so someone else deals with it.
                            return Promise.reject(refreshErr);
                        });

                    break;
                default :
                // Fall through...
            }

        }
        // So all other errors returned to api get/post.
        return Promise.reject(error);

    });

export default NetMgr;
