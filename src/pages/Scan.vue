<template>
    <div>
        <main class="container" id="scan">

            <div class="content narrow">

                <h1>Scan a voucher code</h1>

                <form id="textVoucher" v-on:submit.prevent>

                    <message v-bind:text="message.text" v-bind:state="message.state"></message>

                    <label for="sponsorBox" id="lblSponsorBox" class="hidden">Sponsor Code</label>
                    <label for="voucherBox" id="lblVoucherBox" class="hidden">Voucher Code</label>

                    <div class="input-box">
                        <input id="sponsorBox"
                            @keydown.enter.prevent
                            @keypress='onKeypressSponsorBox'
                            type="text"
                            v-model="sponsorCode"
                            ref="sponsorBox"
                            minlength="2"
                            maxlength="5"
                            autofocus="autofocus"
                            v-bind:class="{ 'input-text-hidden': queued }"
                        >
                        <input id="voucherBox"
                            @keydown.enter.prevent
                            v-on:keyup.delete='onDelVoucherBox'
                            @keypress='onKeypressVoucherBox'
                            type="tel"
                            pattern="[0-9]*"
                            v-model="voucherCode"
                            ref="voucherBox"
                            minlength="4"
                            maxlength="8"
                            v-bind:class="{ 'input-text-hidden': queued }"
                        >
                    </div>

                    <button id="submitVoucher"
                        ref="submitVoucher"
                        v-on:click="onRecordVoucher"
                        v-bind:class="[{ spinner: this.spinner }, { validate: this.validate }, { fail: this.fail }, { queued: this.queued }]"
                        class="cta"
                    ><span class="hidden offscreen">Submit code</span></button>

                </form>

            </div>

            <div>
                <queue v-on:message-update="setMessage"></queue>
            </div>

        </main>

    </div>
</template>

<script>

import Store from '../store.js';
import mixin from '../mixins/mixins';
import Profile from '../components/Profile.vue';
import Queue from '../components/Queue.vue';
import Message from '../components/Message.vue';
import constants from '../constants.js';

var RESULT_TIMER = 1000;

export default {
    name: 'scan',
    mixins: [
        mixin.messages
    ],
    components: {
        Profile,
        Queue
    },
    data: function() {
        return {
            sponsorCode : "",
            voucherCode : "",
            vouchers : Store.trader.vouchers,
            recVouchers : Store.trader.recVouchers,
            netMgr : Store.netMgr,
            spinner: false,
            validate: false,
            fail: false,
            queued: false,
        }
    },
    watch: {
        voucherCode : function(code) {
            if (code.length === parseInt(this.$refs.voucherBox.getAttribute("maxlength"))) {
                this.showQueued(function() {
                    this.onRecordVoucher();
                });
            }
        }
    },
    methods: {
        onRecordVoucher: function(event) {
            //TODO: some proper validation
            if (this.voucherCode !== null && this.voucherCode.length > 0) {
                this.startSpinner();
                Store.addVoucherCode(this.sponsorCode.toUpperCase()+this.voucherCode,
                    // Success function
                    function(response) {
                        if (response.error) {
                            this.showFail();
                            this.setMessage(response.error, constants.MESSAGE_ERROR);

                        } else if (response.warning) {
                              this.showFail();
                              this.setMessage(response.warning, constants.MESSAGE_WARNING);

                        } else {
                            // all in!
                            this.showValidate();
                            this.setMessage("", constants.MESSAGE_STATUS);
                        }
                        // The server has processed our list, clear it.
                        Store.clearVouchers();
                        Store.getRecVouchers();
                    }.bind(this),
                    // Failure function, hook for error message
                    // Network error of some kind;
                    // Don't clear the voucherlist!
                    function(error) {
                        if (!Store.netMgr.online) {
                            this.showQueued();
                            this.setMessage("Not enough signal, voucher queued.", constants.MESSAGE_WARNING);
                        }
                    }.bind(this));

                // Do anyway.
                this.voucherCode = "";
            } else {
                this.showFail();
                this.setMessage(response.error, constants.MESSAGE_ERROR);
            }
        },

        startSpinner: function() {
            this.spinner = true;
        },

        /**
         * setTimeout is used in these showXYZ methods so the animation is displayed for a meaningful amount of time.
         */
        showValidate: function() {
            this.spinner = false;
            this.validate = true;
            setTimeout(function(){
                this.validate = false;
            }.bind(this), RESULT_TIMER);
        },

        showFail: function() {
            this.spinner = false;
            this.fail = true;
            setTimeout(function(){
                this.fail = false;
            }.bind(this), RESULT_TIMER);
        },

        showQueued: function(callback) {
            this.spinner = false;
            this.queued = true;
            setTimeout(function(){
                this.queued = false;
                callback.call(this);
            }.bind(this), RESULT_TIMER);
        },

        /**
         * When the deleting an empty voucherCode,
         *  select the text in the other box
         */
        onDelVoucherBox: function() {
            if (this.voucherCode === null || this.voucherCode.length === 0) {
                this.$refs.sponsorBox.select();
            }
        },

        /**
         * When the sponsorBox is about to change
         *  have a number in it - switch to the voucherBox;
         *  have a smalls in it - caps it.
         */
        onKeypressSponsorBox: function(event) {
            var rxNumber = /\d/;
            var rxSmalls = /^[a-z]$/;
            var rxCaps = /^[A-Z]$/;
            var rxSlash = /\//ig;

            // There's also "event.key" (string), which MDN thinks is better;
            var char = this.getKeyCharCode(event);

            if (this.sponsorCode.length < this.$refs.sponsorBox.getAttribute("maxlength")) {
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
                if (this.voucherCode.length < this.$refs.voucherBox.getAttribute("maxlength")) {
                    this.$refs.voucherBox.focus();
                    this.voucherCode += char;
                }
                return false;
            }

            if (char.match(rxSlash)) {
                event.preventDefault();
                if (this.voucherCode.length < this.$refs.voucherBox.getAttribute("maxlength")) {
                    this.$refs.voucherBox.focus();
                }
                return false;
            }
        },
        onKeypressVoucherBox : function(event) {
            var rxNumber = /\d/;
            var char = this.getKeyCharCode(event);

            if (char.match(rxNumber)) {
                if (this.voucherCode.length < event.target.maxlength) {
                    this.voucherCode += char;
                }
                return;
            }
            //allow enter key to submit
            if (event.key === 'Enter') {
                this.onRecordVoucher();
            }
            event.preventDefault();
            return false;
        },
        getKeyCharCode : function(event) {
            // Try to cross platform catch the keycode
            // Note, there's also "event.which" (int)
            // There's also "event.key" (string), which MDN thinks is better;
            var charCode = event.keyCode ? event.keyCode : event.charCode;
            return String.fromCharCode(charCode);
        }
    },
    mounted: function() {
        Store.getRecVouchers();
        this.$refs.sponsorBox.focus();
    }
}
</script>
