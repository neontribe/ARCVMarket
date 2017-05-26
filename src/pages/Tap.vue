<template>
    <div>
        <main class="container" id="tap">

            <div class="content narrow">

                <h1>Type a voucher code</h1>

                <form id="textVoucher" v-on:submit.prevent>
                    <label for="voucherBox" id="lblVoucherBox" class="hidden">Type a voucher code</label>

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

                    <div class="two-buttons">
                        <button v-on:click="record" id="submitVoucher" class="left" v-bind:class="{ cta : recVouchers[0] && recVouchers[0].length === 0 }">Add <span v-if="recVouchers[0] && recVouchers[0].length > 0">another </span><span v-else>voucher</span></button>
                        <button class="right" v-if="recVouchers[0] && recVouchers[0].length > 0">Get payment</button>
                    </div>

                </form>

           </div>

        </main>
    </div>
</template>

<script>
import Store from '../store.js';
import Profile from '../components/Profile.vue';
export default {
    name: 'tap',
    components: {
        Profile
    },
    data: function() {
        return {
            sponsorCode : "RVP",
            voucherCode : "",
            vouchers : Store.vouchers,
            recVouchers : Store.recVouchers
        }
    },
    methods:  {
        record: function(event) {
            //TODO: some proper validation
            if (this.voucherCode !== null && this.voucherCode.length > 0) {
                if (Store.addVoucherCode(this.sponsorCode.toUpperCase()+this.voucherCode)) {
                    this.voucherCode = "";
                }
            }
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
