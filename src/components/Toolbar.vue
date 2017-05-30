<template id="toolbar">

    <div class="toolbar">
        <transition name="fade" mode="out-in">
            <div :key="voucherCount" v-if="vouchersAdded" class="count"><router-link v-bind:to="'/payment'"><strong>{{ voucherCount }}</strong> voucher<span v-if="voucherCount > 1">s</span> waiting</router-link></div>
        </transition>
        <div class="input-icons">
            <router-link v-bind:to="'/'"><i class="fa fa-keyboard-o" aria-hidden="true"></i></router-link>
            <router-link v-bind:to="'/scan'"><i class="fa fa-camera" aria-hidden="true"></i></router-link>
            <router-link v-bind:to="'/upload'"><i class="fa fa-upload" aria-hidden="true"></i></router-link>
        </div>
    </div>

</template>

<script>
import Store from '../store.js';
export default {
    name: 'toolbar',
    data: function() {
        return {
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
