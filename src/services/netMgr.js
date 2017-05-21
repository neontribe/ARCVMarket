import Config from '../config.js';
import Fixtures from '../../fixtures/fixtures.js';
import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

var NetMgr = {
    token: null,
    mockAdapter: null,
    mocker: null,
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

NetMgr.isAuth = function() {
  if (this.token) {
      var expiryTime = this.token.requestTime + this.token.expires_in;
      if (expiryTime < Math.floor(Date.now()/1000)) {
          return true;
      }
  }
  return false;
};

/**
 * Sets the token, and preps transmission headers
 *
 * @param tokenData
 */
NetMgr.setToken = function (tokenData) {
    this.token = tokenData;
    this.token.requestTime = Math.floor(Date.now()/1000);
    // Add the header to all subsequent axios requests
    this.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + this.token.access_token;
    console.log("token and headers set");
};

/**
 * get new tokens with refresh_token.
 */

NetMgr.refreshAuth = function () {
    if (this.token) {
        this.apiPost('/login/refresh', this.token.refresh_token, function (response) {
            this.setToken(response.data);
        }.bind(this));
    } else {
        console.log("reroute to /login")
    }
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
 * Default error handler, if one isn't provided.
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
 * Removes and stores Mock Adapter and restores original axios
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
        // everything fine! return to api get/post
        console.log("everything fine!");
        return response;
    },
    function (error) {

        var origCfg = error.config;
        console.log(origCfg);

        var origResp = error.response;
        console.log(origResp);

        // A 401 we havn't seen before?
        if (origResp.status === 401 && !origCfg._retry && this.token) {
            console.log("401 refresh available");
            switch (origResp.data.error) {
                case "invalid_token"    : // oAuth2 token invalid
                case "Unauthorized"     :
                case "Unauthenticated." :
                    origCfg._retry = true; // set so we don't hit this one again

                    console.log("Attempting refresh");
                    return NetMgr.apiPost('/login/refresh', NetMgr.token.refresh_token,
                        function (refreshData) {
                            // valid refresh_token, reset and retry
                            NetMgr.setToken(refreshData); //set the token
                            return NetMgr.axiosInstance(origCfg) // retry the request that errored out
                        },
                        function (refreshErr) {
                            //invalid refresh token, logoff
                            console.log("Refresh failed," + refreshErr + " - need to logoff");
                            return Promise.reject(refreshErr);
                        });

                    break;
                default :
            }

        }
        // all other errors returned to api get/post
        return Promise.reject(error);

    }.bind(this));


export default NetMgr;