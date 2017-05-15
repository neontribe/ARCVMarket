import Config from './config.js';
import Fixtures from '../fixtures/fixtures.js';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

var netMgr = {
    mockAdapter: null,
    mocker: null
};

netMgr.apiGet = function (route, cb) {
    if (!route.match(/^\//)) {
        route = '/' + route;
    }
    console.log(route);
    axios.get(Config.apiBase + route)
        .then(cb)
        .catch(this.logAJAXErrors);
};

netMgr.apiPost = function (route, postData, cb) {
    if (!route.match(/^\//)) {
        route = '/' + route;
    }
    axios.post(Config.apiBase + route, postData)
        .then(cb)
        .catch(this.logAJAXErrors);
};

netMgr.logAJAXErrors = function (error) {
    if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
    }
};

netMgr.isMocked = function () {
    return this.mocker;
};

netMgr.mockOn = function () {
    // if there's a mockAdapter add it back in.
    if (this.mockAdapter instanceof MockAdapter) {
        axios.defaults.adapter = this.mockAdapter;
        this.mocker = this.mockAdapter;
    } else {
        this.mocker = new MockAdapter(axios);
        Fixtures.apply(this.mocker);
    }
};

netMgr.mockOff = function () {
    if (this.isMocked()) {
        // save the current mock set
        this.mockAdapter = axios.defaults.adapter;
        // restore axios's previous adapter
        this.mocker.restore();
    }
    this.mocker = false;
};

// set cookie in devtools to ignore mocks in development and connect directly to local API
//document.cookie = "arc_ignore_mocks=true;max-age=" + 86400*30;
if (Config.env === "development" &&
    document.cookie.indexOf("arcv_ignore_mocks=true") === -1
) {
    netMgr.mockOn();
}
export default netMgr;