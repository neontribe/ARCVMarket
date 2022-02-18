<template>
    <div>
        <main id="tap" class="container">
            <div class="content narrow">
                <h1>Type a voucher code</h1>

                <form id="textVoucher" v-on:submit.prevent>
                    <message
                        v-bind:state="message.state"
                        v-bind:text="message.text"
                    ></message>

                    <label id="lblSponsorBox" class="hidden" for="sponsorBox"
                        >Sponsor code</label
                    >
                    <label id="lblVoucherBox" class="hidden" for="voucherBox"
                        >Voucher code</label
                    >

                    <div class="input-box">
                        <input
                            id="sponsorBox"
                            ref="sponsorBox"
                            v-model="sponsorCode"
                            maxlength="5"
                            minlength="2"
                            type="text"
                            @keypress="onKeypressSponsorBox"
                            v-on:paste.prevent
                        />
                        <input
                            id="voucherBox"
                            ref="voucherBox"
                            v-model="voucherCode"
                            maxlength="8"
                            minlength="4"
                            pattern="[0-9]*"
                            type="tel"
                            @keypress="onKeypressVoucherBox"
                            v-on:paste.prevent
                            v-on:keyup.delete="onDelVoucherBox"
                        />
                    </div>

                    <button
                        id="submitVoucher"
                        class="cta"
                        v-bind:class="[
                            { spinner: this.spinner },
                            { validate: this.validate },
                            { fail: this.fail },
                            { queued: this.queued },
                        ]"
                        v-on:click="onRecordVoucher"
                    >
                        <span class="hidden offscreen">Submit code</span>
                    </button>
                </form>
            </div>

            <div>
                <queue v-on:message-update="setMessage"></queue>
            </div>
        </main>
    </div>
</template>

<script>
import Store from "../store.js";
import mixin from "../mixins/mixins";
import Queue from "../components/Queue.vue";
import constants from "../constants";

const RESULT_TIMER = 2000;

export default {
    name: "tap",
    mixins: [mixin.messages],
    components: {
        Queue,
    },
    data: function () {
        return {
            sponsorCode: Store.trader.market.sponsor_shortcode,
            voucherCode: "",
            vouchers: Store.trader.vouchers,
            recVouchers: Store.trader.recVouchers,
            netMgr: Store.netMgr,
            spinner: false,
            validate: false,
            fail: false,
            queued: false,
        };
    },
    methods: {
        onRecordVoucher: function () {
            //TODO: some proper validation
            if (this.voucherCode !== null && this.voucherCode.length > 0) {
                this.startSpinner();
                Store.addVoucherCode(
                    this.sponsorCode.toUpperCase() + this.voucherCode,
                    // Success function
                    function (response) {
                        const responseData = response.data;
                        if (responseData.error) {
                            this.showFail();
                            this.setMessage(
                                responseData.error,
                                constants.MESSAGE_ERROR
                            );
                        } else if (responseData.warning) {
                            this.showFail();
                            this.setMessage(
                                responseData.warning,
                                constants.MESSAGE_WARNING
                            );
                        } else {
                            // all in!
                            this.showValidate();
                            this.message = {};
                            // We're intentionally not setting to responseData.message here.
                        }

                        // The server has processed our list, clear it.
                        Store.clearVouchers();
                        Store.getRecVouchers();
                    }.bind(this),
                    // Failure function, hook for error message
                    // Network error of some kind;
                    // Don't clear the voucher list!
                    function () {
                        if (!Store.netMgr.online) {
                            // set that voucher offline so it goes in the queue
                            this.vouchers[
                                this.vouchers.length - 1
                            ].online = false;
                            this.showQueued();
                            this.setMessage(
                                constants.copy.VOUCHER_LOST_SIGNAL,
                                constants.MESSAGE_WARNING
                            );
                        }
                    }.bind(this)
                );

                // Do anyway.
                this.voucherCode = "";
            } else {
                this.showFail();
                this.setMessage(
                    constants.copy.VOUCHER_SUBMIT_INVALID,
                    constants.MESSAGE_ERROR
                );
            }
        },

        startSpinner: function () {
            this.spinner = true;
        },

        showValidate: function () {
            this.spinner = false;
            this.validate = true;
            setTimeout(
                function () {
                    this.validate = false;
                }.bind(this),
                RESULT_TIMER
            );
        },

        showFail: function () {
            this.spinner = false;
            this.fail = true;
            setTimeout(
                function () {
                    this.fail = false;
                }.bind(this),
                RESULT_TIMER
            );
        },

        showQueued: function () {
            this.spinner = false;
            this.queued = true;
            setTimeout(
                function () {
                    this.queued = false;
                }.bind(this),
                RESULT_TIMER
            );
        },

        /**
         * When the deleting an empty voucherCode,
         *  select the text in the other box
         */
        onDelVoucherBox: function () {
            if (this.voucherCode === null || this.voucherCode.length === 0) {
                this.$refs.sponsorBox.select();
            }
        },

        /**
         * When the sponsorBox is about to change
         *  have a number in it - switch to the voucherBox;
         *  have a smalls in it - caps it.
         */
        onKeypressSponsorBox: function (event) {
            const rxNumber = /\d/;
            const rxSmalls = /^[a-z]$/;
            const rxCaps = /^[A-Z]$/;
            const rxSlash = /\//gi;

            // There's also "event.key" (string), which MDN thinks is better;
            const char = this.getKeyCharCode(event);

            if (
                this.sponsorCode.length <
                this.$refs.sponsorBox.getAttribute("maxlength")
            ) {
                if (char.match(rxCaps)) {
                    event.preventDefault();
                    this.sponsorCode += char;
                }
                if (char.match(rxSmalls)) {
                    event.preventDefault();
                    this.sponsorCode += char.toUpperCase();
                }
            }

            if (char.match(rxNumber)) {
                event.preventDefault();
                if (
                    this.voucherCode.length <
                    this.$refs.voucherBox.getAttribute("maxlength")
                ) {
                    this.$refs.voucherBox.focus();
                    this.voucherCode += char;
                }
                return false;
            }

            if (char.match(rxSlash)) {
                event.preventDefault();
                if (
                    this.voucherCode.length <
                    this.$refs.voucherBox.getAttribute("maxlength")
                ) {
                    this.$refs.voucherBox.focus();
                }
                return false;
            }
        },
        onKeypressVoucherBox: function (event) {
            const rxNumber = /\d/;
            const char = this.getKeyCharCode(event);

            //event.keycode 8 is backspace, dont want to prevent default
            if (event.keyCode !== 8) {
                if (char.match(rxNumber)) {
                    if (this.voucherCode.length < event.target.maxlength) {
                        this.voucherCode += char;
                    }
                    return;
                }
                //allow enter key to submit
                if (event.key === "Enter") {
                    this.onRecordVoucher();
                }
                event.preventDefault();
                return false;
            }
        },
        getKeyCharCode: function (event) {
            // Try to cross platform catch the keycode
            // Note, there's also "event.which" (int)
            // There's also "event.key" (string), which MDN thinks is better;
            const charCode = event.keyCode ? event.keyCode : event.charCode;
            return String.fromCharCode(charCode);
        },
    },
    mounted: function () {
        Store.maybeGetRecVouchers();
    },
};
</script>
