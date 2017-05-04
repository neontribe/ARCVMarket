import axios from 'axios';
import Config from './config.js';

var store = {
    config  : {},
    user    : {"id" : 1},
    trader  : {"id" : 1},
    vouchers: [],
    serverVouchers: []
};

store.getServerVouchers = function() {
    if (!navigator.onLine) {
        return false;
    }
    this.apiGet('traders/1/vouchers', function(response) {
        var newVouchers = response.data.map(function(v) {
            return v.code;
        });
        store.mergeServerVouchers(newVouchers);
    });
    return true;
};

store.apiGet = function(route, callback) {
    if (!route.match(/^\//)) {
        route = '/' + route;
    }
    axios.get(Config.apiBase + route)
        .then(callback)
        .catch(this.logAJAXErrors);
};

store.mergeServerVouchers = function(newVouchers) {
    // em-biggen newVouchers
    Array.prototype.push.apply(newVouchers, this.serverVouchers);
    // de-dupe back to serverVouchers
    this.serverVouchers = newVouchers.sort().filter(function(item, pos, a) {
        return !pos || item != a[pos - 1];
    });
};

store.addVoucherCode = function(voucherCode) {
    this.vouchers.push(voucherCode);
    this.postVouchers();
};

store.clearVouchers = function() {
    this.vouchers =[];
};

store.postVouchers = function() {
    if (!navigator.onLine) {
        return false;
    }
    var postData = {
        'trader_id' : this.trader.id,
        'user_id'   : this.user.id,
        'vouchers'  : this.vouchers
    };

    var self = this;
    this.apiPost('vouchers',postData, function(response){
        // reset the voucher list
        console.log(self.vouchers);
        // get the server vouchers
        //this.getServerVouchers();
    });
    return true;
};

store.apiPost = function(route, postData, callback) {
    if (!route.match(/^\//)) {
        route = '/' + route;
    }

    axios.post(Config.apiBase+route, postData)
        .then(callback)
        .catch(this.logAJAXErrors);
};

store.logAJAXErrors = function(error) {
    if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    }
};

export default store;

