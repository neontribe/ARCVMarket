<template>

    <div id="app">

        <header>
            <img src="./assets/logo.png">
        </header>

        <div class="container">
          <div class="content">

                <h1>Add a voucher</h1>

                <form id="textVoucher" v-on:submit.prevent>
                    <label for="voucherBox" id="lblVoucherBox">Type a voucher code</label>

                    <div class="input-box">
                      <input id="sponsorBox"
                             @keypress='onChangeSponsorBox'
                             type="text"
                             v-model="sponsorCode"
                             ref="sponsorBox"
                             maxlength="3"
                      >
                      <input id="voucherBox"
                             v-on:keyup.delete='onDelVoucherBox'
                             type="text"
                             v-model="voucherCode"
                             ref="voucherBox"
                             maxlength="8"
                      >
                    </div>

                    <button v-on:click="record" id="submitVoucher">Add</button>
                    <h3>Current: <span id=output> {{ sponsorCode+voucherCode }} </span></h3>
                </form>
            </div>

            <div id="registeredVouchers" v-if="recVouchers.length > 0">
                <h2>Your recorded vouchers</h2>
                <ul id="recVouchersList">
                    <li v-for="recVoucher in recVouchers[0]">
                        {{ recVoucher }}
                    </li>
                </ul>
            </div>

        </div>

    </div>
</template>

<script>
import Store from './store.js';

export default {
    name: 'app',
    data: function() {
        return {
            sponsorCode : "RVP",
            voucherCode : "",
            vouchers : Store.vouchers,
            recVouchers : Store.recVouchers
        }
    },
    mounted: function() {
        // initialise the current vouchers list;
        Store.getRecVouchers();
    },
    methods:  {
        record: function(event) {
            //TODO: some proper validation
            if (this.voucherCode !== null && this.voucherCode.length > 0) {
                if (Store.addVoucherCode(this.sponsorCode+this.voucherCode)) {
                    this.voucherCode = "";
                };
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
        onChangeSponsorBox: function(event) {
            var rxNumber = /\d/;
            var rxSmalls = /^[a-z]$/;
            var rxCaps = /^[A-Z]$/;

            // Try to cross platform catch the keycode
            // Note, there's also "event.which" (int) and

            var charCode = event.keyCode ? event.keyCode : event.charCode;

            // There's also "event.key" (string), which MDN thinks is better;
            var char = String.fromCharCode(charCode);

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
        }
    }
}
</script>

<style lang="scss">
    @import "sass/app.scss";
</style>
