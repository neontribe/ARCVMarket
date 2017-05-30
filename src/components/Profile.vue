<template id="profile">

    <div class="profile-bar">
        <div>Managing <router-link v-bind:to="'/user'"><strong>{{ selectedTrader.name }}</strong></router-link></div>
        <div v-if="length"><strong>{{ count }}</strong> vouchers waiting</div>
    </div>

</template>

<script>
import Store from '../store.js';
export default {
    name: 'profile',
    data: function() {
        return {
            selectedTrader: Store.trader,
            recVouchers : Store.recVouchers,
            count : 0
        }
    },
    mounted: function() {
        Store.getRecVouchers();
    },
    computed: {
        length: function() {
            if (this.recVouchers[0] && this.recVouchers[0].length > 0) {
              this.count = this.recVouchers[0].length;
              return true;
            }
        }
    }
}
</script>
