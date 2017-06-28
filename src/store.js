import NetMgr from './services/netMgr.js';

// TODO store.error needs store based setter.
var store = {
    user: {
        id : 1,
        traders : []
    },
    trader: {
        id: null,
        pendedVouchers: [],
        vouchers: [],
        recVouchers: []
    },
    netMgr: NetMgr,
    auth: false,
    error: null,
    queue: {
        sendingStatus: false
    },
};

store.resetStore = function() {
    // TODO : I'm thinking we need some user/trader objects that manage this.
    this.user = {
        id: null,
        traders : []
    };
    this.trader = {
        id : null,
        pendedVouchers : [],
        vouchers: [],
        recVouchers: []
    };
    this.trader.vouchers = this.trader.vouchers.splice(0, this.trader.vouchers.length);
    this.trader.recVouchers = this.trader.recVouchers.splice(0, this.trader.recVouchers.length);
    this.error = null;
    window.localStorage.clear();
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
            var err = null;
            switch (error.response.status) {
                case 401 :
                    err = "The username and password combination entered was not recognised. Please check your details and try again.";
                    break;
                default :
                    err = "Something unusual has happened.";
            }
            if (failure) {
                failure(err);
            }
        }.bind(this)
    );
};

/**
 * Logs the user off
 */
store.unAuthenticate = function (success, failure) {
    // Hit the logout endpoint.
    this.netMgr.apiPost('/logout', null,
        function (response) {
            if (success) {
                success(response);
            }
        }.bind(this),
        function (error) {
            if (failure) {
                failure(error);
            }
        });
    // tidy up store stuff.
    this.resetStore();
    this.netMgr.setToken(null);
};

/**
 * Updates the current User's Traders
 * @returns {boolean}
 */
store.getUserTraders = function() {
    this.netMgr.apiGet('/traders', function(response) {
        this.user.traders.splice(0, this.user.traders.length, response.data);
    }.bind(this));
    return true;
};

/**
 * User.trader to assign to trader.
 * @param id
 * @returns {boolean}
 */
store.setUserTrader = function(id) {
    this.trader = this.user.traders[0].filter(function(userTrader) {
        return userTrader.id === id;
    })[0];
    this.trader.pendedVouchers = [];
    this.trader.vouchers = [];
    this.trader.recVouchers = [];

    this.setLocalStorageFromUserTraders();

    return (this.trader.id === id);
};

/**
 * Attempts to set User and Trader information based off of information stored in localStorage.
 *
 * Will throw a console error if the information stored is invalid JSON and default to the existing info in this case.
 */
store.setUserTradersFromLocalStorage = function(submitVouchers = true) {
    let user = localStorage['Store.user'];
    let trader = localStorage['Store.trader'];

    let parsedUser = this.user;
    let parsedTrader = this.trader;

    try {
        parsedUser = JSON.parse(user);
        parsedTrader = JSON.parse(trader);
    } catch (e) {
        console.error('Invalid token stored in localstorage.');
    }

    this.user = parsedUser;
    this.trader = parsedTrader;

    if(submitVouchers && parsedTrader.vouchers && parsedTrader.vouchers.length > 0) {
        this.queue.sendingStatus = true;
        this.transitionVouchers('collect', this.trader.vouchers, function() {
            // The server has processed our list, clear it.
            this.clearVouchers();
            this.getRecVouchers();

            this.queue.sendingStatus = false;
        }.bind(this),
        function() {
            this.queue.sendingStatus = false;
        }.bind(this));
    }
};


/**
 * Manages all localStorage settings for the store object.
 */
store.setLocalStorageFromUserTraders = function() {
    localStorage['Store.user'] = JSON.stringify(this.user);
    localStorage['Store.trader'] = JSON.stringify(this.trader);
};

/**
 *
 * @returns {boolean}
 */
store.getVoucherPaymentState = function () {
    this.netMgr.apiGet('traders/' + this.trader.id + '/voucher-history', function (response) {
        this.trader.pendedVouchers.splice(0, this.trader.pendedVouchers.length, response.data);
    }.bind(this));
    return true;
};

/**
 * Gets the server's idea of a trader's recorder voucher list
 */
store.getRecVouchers = function () {
    this.netMgr.apiGet('/traders/' + this.trader.id + '/vouchers?status=unconfirmed',
        function (response) {
            var newVouchers = Object.keys(response.data).map(function(k){
                return response.data[k];
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
    // This zeros the array and re-add things in a vue-friendly way.
    this.trader.recVouchers.splice(0, this.trader.recVouchers.length, replacements);
    // Changed the recVouchers! Quick, save them!
    this.setLocalStorageFromUserTraders();
};

/**
 * Adds a voucher code and submits it.
 */
store.addVoucherCode = function (voucherCode, success, failure, invalid) {
    this.trader.vouchers.push(voucherCode);
    // Store the whole trader
    this.setLocalStorageFromUserTraders();
    this.transitionVouchers('collect', this.trader.vouchers, success, failure, invalid);
};

/**
 * Transition request the recorded vouchers list to pending
 */
store.pendRecVouchers = function (success,failure) {
    // The [0] is vue wierdness
    var voucherCodes = this.trader.recVouchers[0].map(function(voucher) {
        return voucher.code;
    });
    // Execute the transition
    this.transitionVouchers('confirm', voucherCodes, success, failure);
};

/**
 * empties the vouchers
 */
store.clearVouchers = function () {
    // Alter current array, not swap for new one or vue gets sad!
    this.trader.vouchers.splice(0, this.trader.vouchers.length);
    // Trader has changed, alter it.
    this.setLocalStorageFromUserTraders();
};

/**
 * Post vouchers to api to start a transition.
 * @returns {boolean}
 */
store.transitionVouchers = function (transition, vouchers, success, failure) {
    var postData = {
        'transition' : transition,
        'trader_id': this.trader.id,
        'vouchers': vouchers
    };
    this.netMgr.apiPost('vouchers', postData,
        function (response) {
            if (success) {success(response)}
        },
        function(error) {
            if (failure) {failure(error)}
        }
    );
};

export default store;
