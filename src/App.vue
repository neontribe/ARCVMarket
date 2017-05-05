<template>

    <div id="app">

        <header>
            <img src="./assets/logo.png">
        </header>

        <div class="content">

            <h1>You want to add a voucher</h1>

            <div id="input">
                <form id="textVoucher" v-on:submit.prevent>
                    <label for="voucherBox" id="lblVoucherBox">Type a voucher code</label>

                    <input id="sponsorBox"
                           @keypress.prevent='onChangeSponsorBox'
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

                    <button v-on:click="record" id="submitVoucher">Add</button>
                    <p>Current: <span id=output> {{ voucherCode }} </span></p>
                </form>
                <div v-if="vouchers.length > 0">
                    <h2>Unsent Queue</h2>
                    <ul id="unsentVouchers">
                        <li v-for="voucher in vouchers">
                            {{ voucher }}
                        </li>
                    </ul>
                </div>
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
            sponsorCode : "SOL",
            voucherCode : "",
            vouchers : Store.vouchers,
            serverVouchers : Store.serverVouchers
        }
    },
    mounted: function() {

    },
    methods:  {
        record: function(event) {
            //TODO: some proper validation
            if (this.voucherCode !== null && this.voucherCode.length > 0) {
                if (Store.addVoucherCode(this.voucherCode)) {
                    this.voucherCode = null;
                };
            }
        },

        /**
         * When the deleting an emty vouchCode,
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

            var char = String.fromCharCode(event.keyCode);

               console.log(this.$refs.sponsorBox);

            if (this.sponsorCode.length < this.$refs.sponsorBox.maxlength) {

                if (char.match(rxCaps)) {
                    this.sponsorCode += char;
                }

                if (char.match(rxSmalls)) {
                    this.sponsorCode += char.toUpperCase();
                }
            }

            if (char.match(rxNumber)) {
                this.$refs.voucherBox.focus()
                this.voucherCode += char;
            }

        }

    }
}






</script>

<style lang="scss">
    @import "sass/app.scss";
</style>
