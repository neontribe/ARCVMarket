import Vue from 'vue';
import NetMgr from './services/netMgr.js';

var store = {
    user: {"id": 1},
    trader: {
        "id": 1,
        pendedVouchers: []
    },
    vouchers: [],
    recVouchers: [],
    netMgr: NetMgr,
    auth: false
};

/**
 * Called from vue componenets, proxies logon process for them.
 * @param userApiCreds
 * @param success
 * @param failure
 */
store.authenticate = function (userApiCreds, success, failure) {
    this.netMgr.apiPost('/login', userApiCreds,
        function (response) {
            this.netMgr.setToken(response.data);
            success();
        }.bind(this),
        function (error) {
            if (failure) {
                failure(error)
            }
        }
    );
};

/**
 * Logs the user off
 */
store.unAuthenticate = function () {
    this.netMgr.apiPost('/logout', null, function (response) {
        this.netMgr.setToken(null);
        this.auth = this.netMgr.isAuth();
        // TODO: add store reset code.
    }.bind(this));
};

store.getVoucherPaymentState = function () {
    this.netMgr.apiGet('traders/' + this.user.id + '/vouchers/history', function (response) {
        this.trader.pendedVouchers.splice(0, this.trader.pendedVouchers.length, response.data);
    }.bind(this));
    return true;
};

/**
 * Gets the server's idea of a trader's recorder voucher list
 */
store.getRecVouchers = function () {
    this.netMgr.apiGet('/traders/' + this.user.id + '/vouchers',
        function (response) {
            var newVouchers = response.data;
            newVouchers.sort(function (b, a) {
                return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
            });
            this.mergeRecVouchers(newVouchers);
        }.bind(this));
    return true;
};

/**
 * Vue's observation of arrays is tricky. This replaces the an array.
 * @param replacements
 */
store.mergeRecVouchers = function (replacements) {
    // this zeros the array and re-add things in a vue-friendly way
    this.recVouchers.splice(0, this.recVouchers.length, replacements);
};

/**
 * Adds a voucher code and submits it.
 */
store.addVoucherCode = function (voucherCode) {
    this.vouchers.push(voucherCode);
    return this.postVouchers();
};

/**
 * empties the vouchers
 */
store.clearVouchers = function () {
    // alter current array, not swap for new one or vue gets sad!
    this.vouchers.splice(0, this.vouchers.length);
};

/**
 * Post vouchers to api.
 * @returns {boolean}
 */
store.postVouchers = function () {
    if (!navigator.onLine) {
        return false;
    }
    var postData = {
        'trader_id': this.trader.id,
        'vouchers': this.vouchers
    };

    this.netMgr.apiPost('vouchers', postData, function (response) {
        // now we get the return values;
        store.getRecVouchers();
    });
    return true;
};

export default store;