
import axios from 'axios';
import Config from './config.js';

var store = {
    config  : Config,
    user    : {"id" : 1},
    trader  : {"id" : 1},
    vouchers: [],
    recVouchers: []
};

store.getRecVouchers = function() {

    if (!navigator.onLine) {
        return false;
    }

    this.apiGet('traders/'+this.user.id +'/vouchers', function(response) {
        var newVouchers = response.data;
        newVouchers.sort(function(b,a) {
            return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        });
        newVouchers = response.data.map(function(v) {
            return v.code;
        });
        // this is a callback. scoping of "this" gets broken, explicitly using "store".
        store.mergeRecVouchers(newVouchers);
    });
    return true;
};

store.apiGet = function(route, cb) {
    if (!route.match(/^\//)) {
        route = '/' + route;
    }
    axios.get(Config.apiBase + route)
        .then(cb)
        .catch(this.logAJAXErrors);
};

store.mergeRecVouchers = function(replacements) {
    // this zeros the array and re-add things in a vue-friendly way
    this.recVouchers.splice(0,this.recVouchers.length, replacements);
};

store.addVoucherCode = function(voucherCode) {
    this.vouchers.push(voucherCode);
    return this.postVouchers();
};

store.clearVouchers = function() {
    // alter current array, not swap for new one or vue gets sad!
    this.vouchers.splice(0,this.vouchers.length);
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

    this.apiPost('vouchers', postData, function(response){
        // now we et the return values;
        store.getRecVouchers();
    });
    return true;
};

store.apiPost = function(route, postData, cb) {
    if (!route.match(/^\//)) {
        route = '/' + route;
    }
    axios.post(Config.apiBase+route, postData)
        .then(cb)
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
