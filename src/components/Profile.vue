<template id="profile">

    <div class="profile-bar">
        <div>Managing <router-link v-bind:to="'/user'"><strong>{{ selectedTrader.name }}</strong></router-link></div>
        <transition name="fade" mode="out-in">
            <div :key="voucherCount" v-if="vouchersAdded"><router-link v-bind:to="'/payment'"><strong>{{ voucherCount }}</strong> voucher<span v-if="voucherCount > 1">s</span> waiting</router-link></div>
        </transition>
    </div>

</template>

<script>
import Store from '../store.js';
export default {
    name: 'profile',
    data: function() {
        return {
            selectedTrader : Store.trader,
            recVouchers : Store.recVouchers,
            voucherCount : 0
        }
    },
    mounted: function() {
        Store.getRecVouchers();
    },
    computed: {
        vouchersAdded: function() {
            if (this.recVouchers[0] && this.recVouchers[0].length > 0) {
              this.voucherCount = this.recVouchers[0].length;
              return true;
            }
        }
    }
}
</script>
