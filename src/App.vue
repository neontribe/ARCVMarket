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
                    <input id="voucherBox"
                           type="text"
                           v-model="voucherCode"
                    >
                    <button v-on:click="record" id="submitVoucher">Add</button>
                    <p>Current: <span id=output> {{ voucherCode }} </span></p>
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
            voucherCode : null,
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
                if (Store.addVoucherCode(this.voucherCode)) {
                    this.voucherCode = null;
                };
            }
        }
    }
}


</script>

<style lang="scss">
    @import "sass/app.scss";
</style>
