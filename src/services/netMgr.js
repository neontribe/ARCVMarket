import Config from '../config.js';
import Fixtures from '../../fixtures/fixtures.js';
import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

var NetMgr = {
    token : null,
    mockAdapter: null,
    mocker: null,
    axiosInstance : Axios.create({
        baseURL: Config.apiBase,
        timeout: 10000,
        headers: {
            common : {
                'X-Requested-With': 'XMLHttpRequest', // for laravel
            }
        }
    })
};

NetMgr.authenticate = function (userApiCreds, cb) {
    this.apiPost('/login',userApiCreds,function(response) {

        // Change the token out
        this.token = response.data;

        // Set a trigger to autorefresh the token
        this.token.timer = setTimeout(this.refresh(), this.token.expires_in*1000);

        // TODO: intercceptors here;
        // Add the header to all subsequent axios requests
        this.axiosInstance.headers.common['Authorization'] = 'Bearer ' + this.token.access_token;

    }.bind(this));
};

NetMgr.refresh = function (cb) {
    this.apiPost('/login/refresh', function(response) {

    });
};


NetMgr.apiGet = function (route, cb) {
    if (!route.match(/^\//)) {
        route = '/' + route;
    }
    console.log(this.axiosInstance.defaults);
    this.axiosInstance.get(route)
        .then(cb)
        .catch(this.logAJAXErrors);
};

NetMgr.apiPost = function (route, postData, cb) {
    if (!route.match(/^\//)) {
        route = '/' + route;
    }
    this.axiosInstance.post(route, postData)
        .then(cb)
        .catch(this.logAJAXErrors);
};

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

NetMgr.isMocked = function () {
    return this.mocker;
};

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
//document.cookie = "arcv_ignore_mocks=true;max-age=" + 86400*30;
if ( Config.env === "development" && ( document.cookie.indexOf("arcv_ignore_mocks=true") === -1 ) ) {
        NetMgr.mockOn();
}

export default NetMgr;