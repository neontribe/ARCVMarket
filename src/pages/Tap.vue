<template>
    <div>
        <main class="container" id="tap">

            <div class="content narrow">

                <h1>Type a voucher code</h1>

                <form id="textVoucher" v-on:submit.prevent>
                    <transition name="fade"><div v-if="errorMessage" class="message">{{ errorMessage }}</div></transition>
                    <label for="sponsorBox" id="lblSponsorBox" class="hidden">Sponsor Code</label>
                    <label for="voucherBox" id="lblVoucherBox" class="hidden">Voucher code</label>

                    <div class="input-box">
                        <input id="sponsorBox"
                            @keypress='onKeypressSponsorBox'
                            type="text"
                            v-model="sponsorCode"
                            ref="sponsorBox"
                            maxlength="3"
                        >
                        <input id="voucherBox"
                            v-on:keyup.delete='onDelVoucherBox'
                            @keypress='onKeypressVoucherBox'
                            type="tel"
                            pattern="[0-9]*"
                            v-model="voucherCode"
                            ref="voucherBox"
                            maxlength="8"
                        >
                    </div>

                    <button id="submitVoucher"
                        v-on:click="onRecordVoucher"
                        v-bind:class="[{ spinner: this.spinner }, { validate: this.validate }, { fail: this.fail }]"
                        class="cta"
                    ><span class="hidden offscreen">Submit code</span></button>

                </form>

           </div>

           <queue></queue>

        </main>

    </div>
</template>

<script>
import Store from '../store.js';
import Profile from '../components/Profile.vue';
import Queue from '../components/Queue.vue';
export default {
    name: 'tap',
    components: {
        Profile,
        Queue
    },
    data: function() {
        return {
            sponsorCode : "RVP",
            voucherCode : "",
            vouchers : Store.vouchers,
            recVouchers : Store.recVouchers,
            errorMessage : Store.error,
            spinner: false,
            validate: false,
            fail: false
        }
    },
    methods:  {
        onRecordVoucher: function(event) {
            this.startSpinner();
            //TODO: some proper validation
            if (this.voucherCode !== null && this.voucherCode.length > 0) {
                Store.addVoucherCode(this.sponsorCode.toUpperCase()+this.voucherCode,
                    // Success function
                    function(response) {
                        // Add error message for invalid and fail codes.
                        if (
                            response.data.invalid.length > 0
                            || response.data.fail.length > 0
                        ) {
                            this.showFail();
                            this.errorMessage = "Please enter a valid code.";
                        } else {
                            this.showValidate();
                            this.errorMessage = "";
                        }
                        Store.clearVouchers();
                        Store.getRecVouchers();
                    }.bind(this),
                    // Failure function, hook for error message
                    function() {
                    });
                // Do anyway.
                this.voucherCode = "";
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
    }
}
</script>
