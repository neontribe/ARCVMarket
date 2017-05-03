<template>
    <div id="app">
        <transition name="fade">
        <div id="input">
            <form id="textVoucher" action="" target="">
                <label for="voucherBox" id="lblVoucherBox">enter your vouchers</label>
                <input id="voucherBox"
                       type="text"
                       v-model="voucherCode"
                       placeholder="Enter Code"
                >
                <input type="submit">
                <p><span id=output> {{ voucherCode }} </span></p>
            </form>
        </div>
        </transition>
    </div>

</template>

<script>
import Store from './store.js';

export default {
    name: 'app',
    data: function() {
        return {
        voucherCode : null
        }
    },
    mounted: function() {
        // function here is to get pull data bas
    }
}

</script>

<style lang="scss">
    @import "sass/app.scss"
</style>
