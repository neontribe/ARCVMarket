<template>
    <div>
        <main class="container" id="scan">

            <div class="content narrow">

                <h1>Scan a voucher code</h1>

                <form id="textVoucher" v-on:submit.prevent>
                    <transition name="fade"><div v-if="errorMessage" class="message">{{ errorMessage }}</div></transition>
                    <label for="sponsorBox" id="lblSponsorBox" class="hidden">Sponsor code</label>
                    <label for="voucherBox" id="lblVoucherBox" class="hidden">Voucher code</label>

                    <div class="input-box">
                        <input id="sponsorBox"
                            @keypress='onKeypressSponsorBox'
                            type="text"
                            v-model="sponsorCode"
                            ref="sponsorBox"
                            minlength="2"
                            maxlength="5"
                            autofocus="autofocus"
                        >
                        <input id="voucherBox"
                            v-on:keyup.delete='onDelVoucherBox'
                            @keypress='onKeypressVoucherBox'
                            type="tel"
                            pattern="[0-9]*"
                            v-model="voucherCode"
                            ref="voucherBox"
                            minlength="4"
                            maxlength="8"
                        >
                    </div>

                    <button id="submitVoucher"
                        ref="submitVoucher"
                        v-on:click="onRecordVoucher"
                        v-bind:class="[{ spinner: this.spinner }, { validate: this.validate }, { fail: this.fail }]"
                        class="cta"
                    ><span class="hidden offscreen">Submit code</span></button>

                </form>

            </div>

            <div v-if="this.vouchers.length > 1">
                <queue ></queue>
            </div>

        </main>

    </div>
</template>

<script>

import Store from '../store.js';
import Profile from '../components/Profile.vue';
import Queue from '../components/Queue.vue';
export default {
    name: 'scan',
    components: {
        Profile,
        Queue
    },
    data: function() {
        return {
            sponsorCode : "",
            voucherCode : "",
            vouchers : Store.vouchers,
            recVouchers : Store.recVouchers,
            errorMessage : Store.error,
            spinner: false,
            validate: false,
            fail: false
        }
    },
    watch: {
        voucherCode : function(code) {
            if (code.length === parseInt(this.$refs.voucherBox.getAttribute("maxlength"))) {
                this.$refs.submitVoucher.click();
            }
        }
    },
    methods:  {
        onRecordVoucher: function(event) {
            //TODO: some proper validation
            if (this.voucherCode !== null && this.voucherCode.length > 0) {
                this.startSpinner();
                Store.addVoucherCode(this.sponsorCode.toUpperCase()+this.voucherCode,
                    // Success function
                    function(response) {
                        // Add error message for invalid and fail codes.
                        var data = response.data;

                        if (data.invalid.length + data.fail.length === 1) {
                            // single mismatch handler;
                            if (data.invalid.length > 0) {
                                this.showFail();
                                this.errorMessage = "Please enter a valid voucher code.";

                            } else if (data.fail.length > 0) {
                                this.showFail();
                                this.errorMessage = "That voucher may have been used already.";
                            }

                        } else if (data.invalid.length + data.fail.length > 1) {
                            // rough multifailure manager
                            this.showFail();
                            this.errorMessage = `[xXx] ${data.success.length} accepted,
                                ${data.fail.length} rejected
                                and ${data.invalid.length} were invalid.`;
                        } else {
                            // all in!
                            this.showValidate();
                            this.errorMessage = "";
                        }
                        // The server has processed our list, clear it.
                        Store.clearVouchers();
                        Store.getRecVouchers();
                    }.bind(this),
                    // Failure function, hook for error message
                    function(error) {
                    //network error of some kind;
                    //don't clear the voucherlist!
                    });
                // Do anyway.
                this.voucherCode = "";
                this.sponsorCode = "";
                this.$refs.sponsorBox.focus();
            } else {
              this.showFail();
              this.errorMessage = "Please enter a valid voucher code.";
            }
        },

        startSpinner: function() {
            this.spinner = true;
        },

        showValidate: function() {
            this.spinner = false;
            this.validate = true;
            var self = this;
            setTimeout(function(){
                self.validate = false;
            }, 2000);
        },

        showFail: function() {
            this.spinner = false;
            this.fail = true;
            var self = this;
            setTimeout(function(){
                self.fail = false;
            }, 2000);
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
