import NetMgr from "./services/netMgr.js";
import constants from "./constants";
import parseLinkHeader from "parse-link-header";

// TODO store.error needs store based setter.
let store = {
    user: {
        id: 1,
        traders: [],
    },
    trader: {
        id: null,
        pendedVouchers: [],
        pendedVoucherPagination: {},
        vouchers: [],
        recVouchers: [],
        market: {
            payment_message: "",
            sponsor_shortcode: "",
        },
    },
    netMgr: NetMgr,
    auth: false,
    error: null,
    queue: {
        sendingStatus: false,
        sentData: null,
    },
    gettingRecVouchers: 0,
};

/**
 * Reset the store object
 */
store.resetStore = function () {
    // Wipe the current user
    this.user = {
        id: null,
        traders: [],
    };
    // Wipe the current trader details
    this.trader = {
        id: null,
        pendedVouchers: [],
        vouchers: [],
        recVouchers: [],
        market: {
            payment_message: "",
            sponsor_shortcode: "",
        },
    };
    // Init the vouchers
    this.trader.vouchers = this.trader.vouchers.splice(
        0,
        this.trader.vouchers.length
    );
    this.trader.recVouchers = this.trader.recVouchers.splice(
        0,
        this.trader.recVouchers.length
    );
    this.error = null;
    // Clear local storage
    window.localStorage.clear();
};

/**
 * Returns a flat array of voucher codes.
 *
 * @return {*[]}
 */
store.getTraderVoucherList = function () {
    return this.trader.vouchers.map(function (v) {
        return v.code;
    });
};

/**
 * Returns false if any of the vouchers were recorded whilst the user was offline.
 * @return {boolean}
 */
store.getVouchersOnlineStatus = function () {
    // Loop through the voucher list. If we get to one that was added off-line, return with false.
    for (let voucher in this.trader.vouchers) {
        if (!this.trader.vouchers[voucher].online) {
            return false;
        }
    }
    return true;
};

/**
 * Called from vue components, proxies logon process for them.
 * @param userApiCredentials
 * @param success
 * @param failure
 */
store.authenticate = function (userApiCredentials, success, failure) {
    this.netMgr.apiPost(
        "/login",
        userApiCredentials,
        function (response) {
            this.netMgr.setToken(response.data);
            success();
        }.bind(this),
        function (error) {
            let err;
            switch (error.response.status) {
                case 401:
                    err = constants.copy.INVALID_CREDENTIALS;
                    break;
                default:
                    err = constants.copy.UNKNOWN_EVENT;
            }
            if (failure) {
                failure(err);
            }
        }.bind(this)
    );
};

/**
 * Logs the user off
 * @param success
 * @param failure
 */
store.unAuthenticate = function (success, failure) {
    // Hit the logout endpoint.
    this.netMgr.apiPost(
        "/logout",
        null,
        function (response) {
            if (success) {
                success(response);
            }
        }.bind(this),
        function (error) {
            if (failure) {
                failure(error);
            }
        }
    );
    // tidy up store stuff.
    this.resetStore();
    this.netMgr.setToken(null);
};

/**
 * Updates the current User's Traders
 * @returns {boolean}
 */
store.getUserTraders = function () {
    this.netMgr.apiGet(
        "/traders",
        function (response) {
            this.user.traders.splice(
                0,
                this.user.traders.length,
                response.data
            );
        }.bind(this)
    );
};

/**
 * User.trader to assign to trader.
 * @param id
 * @returns {boolean}
 */
store.setUserTrader = function (id) {
    this.trader = this.user.traders[0].filter(function (userTrader) {
        return userTrader.id === id;
    })[0];
    this.trader.pendedVouchers = [];
    this.trader.vouchers = [];
    this.trader.recVouchers = [];

    this.setLocalStorageFromUserTraders();

    return this.trader.id === id;
};

/**
 * Try to set User and Trader from information stored in localStorage.
 * @param submitVouchers
 */
store.setUserTradersFromLocalStorage = function (submitVouchers = true) {
    let user = localStorage["Store.user"];
    let trader = localStorage["Store.trader"];

    let parsedUser = this.user;
    let parsedTrader = this.trader;

    try {
        parsedUser = JSON.parse(user);
        parsedTrader = JSON.parse(trader);
    } catch (e) {
        console.error("Invalid token stored in localstorage.");
    }

    this.user = parsedUser;
    this.trader = parsedTrader;

    if (
        submitVouchers &&
        parsedTrader.vouchers &&
        parsedTrader.vouchers.length > 0
    ) {
        this.queue.sendingStatus = true;
        this.transitionVouchers(
            "collect",
            this.getTraderVoucherList(),
            function (response) {
                // The server has processed our list, clear it.
                this.clearVouchers();
                this.getRecVouchers();

                this.queue.sentData = response;
                this.queue.sendingStatus = false;
            }.bind(this),
            function () {
                this.queue.sendingStatus = false;
            }.bind(this)
        );
    }
};

/**
 * Manages all localStorage settings for the store object.
 */
store.setLocalStorageFromUserTraders = function () {
    localStorage["Store.user"] = JSON.stringify(this.user);
    localStorage["Store.trader"] = JSON.stringify(this.trader);
};

/**
 *
 * @param pageNum
 */
store.getVoucherPaymentState = function (pageNum = 1) {
    this.netMgr.apiGet(
        "traders/" + this.trader.id + "/voucher-history?page=" + pageNum,
        function (response) {
            this.trader.pendedVoucherPagination =
                parseLinkHeader(response.headers["links"]) ?? {};
            this.trader.pendedVouchers.splice.apply(
                this.trader.pendedVouchers,
                [0, this.trader.pendedVouchers.length].concat(response.data)
            );
        }.bind(this)
    );
};

/**
 * initialises a get IF one is not already in play.
 */
store.maybeGetRecVouchers = function () {
    if (this.gettingRecVouchers === 0) {
        this.getRecVouchers();
    }
};

/**
 * Gets the server's idea of a trader's recorder voucher list
 */
store.getRecVouchers = function () {
    this.gettingRecVouchers = this.gettingRecVouchers + 1;
    this.netMgr.apiGet(
        "/traders/" + this.trader.id + "/vouchers?status=unconfirmed",
        function (response) {
            let newVouchers = Object.keys(response.data).map(function (k) {
                return response.data[k];
            });
            this.mergeRecVouchers(newVouchers);
            this.gettingRecVouchers = this.gettingRecVouchers - 1;
        }.bind(this),
        function (error) {
            this.netMgr.logAJAXErrors(error);
            this.gettingRecVouchers = this.gettingRecVouchers - 1;
        }.bind(this)
    );
};

/**
 * Vue observation of arrays is tricky. This replaces the an array.
 * @param replacements
 */
store.mergeRecVouchers = function (replacements) {
    // This zeros the array and re-add things in a vue-friendly way.
    this.trader.recVouchers.splice(
        0,
        this.trader.recVouchers.length,
        replacements
    );
    // Changed the recVouchers! Quick, save them!
    this.setLocalStorageFromUserTraders();
};

/**
 * Adds a voucher code and submits it.
 * @param voucherCode
 * @param success
 * @param failure
 */
store.addVoucherCode = function (voucherCode, success, failure) {
    // Add a voucher to the list
    this.trader.vouchers.push({
        code: voucherCode,
        online: this.netMgr.online,
    });

    // Store the whole trader
    this.setLocalStorageFromUserTraders();

    // Post it to the backend
    this.transitionVouchers(
        "collect",
        this.getTraderVoucherList(),
        success,
        failure
    );
};

/**
 * Informs the server we've deleted a voucher.
 * @param voucherCode
 * @param success
 * @param failure
 */
store.delVoucher = function (voucherCode, success, failure) {
    // POST to the server
    this.transitionVouchers("reject", [voucherCode], success, failure);
};

/**
 * Transition request the recorded vouchers list to pending
 * @param success
 * @param failure
 */
store.pendRecVouchers = function (success, failure) {
    // The [0] is vue weirdness
    const voucherCodes = this.trader.recVouchers[0].map(function (voucher) {
        return voucher.code;
    });
    // Execute the transition
    this.transitionVouchers("confirm", voucherCodes, success, failure);
};

/**
 * Empties the vouchers
 */
store.clearVouchers = function () {
    // Alter current array, not swap for new one or vue gets sad!
    this.trader.vouchers.splice(0, this.trader.vouchers.length);
    // Trader has changed, alter it.
    this.setLocalStorageFromUserTraders();
};

/**
 * Post vouchers to api to start a transition.
 * @param transition
 * @param vouchers
 * @param success
 * @param failure
 * @return {Promise<TResult>}
 */
store.transitionVouchers = function (transition, vouchers, success, failure) {
    const postData = {
        transition: transition,
        trader_id: this.trader.id,
        vouchers: vouchers,
    };
    return this.netMgr.apiPost(
        "vouchers",
        postData,
        function (response) {
            if (success) {
                success(response);
            }
        },
        function (error) {
            if (failure) {
                failure(error);
            }
        }
    );
};

export default store;
