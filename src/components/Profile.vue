<template id="profile">

    <div class="profile-bar">
        <div>Managing <router-link v-bind:to="'/user'"><strong>{{ selectedTrader.name }}</strong></router-link></div>
        <div v-if="recVouchers[0] && recVouchers[0].length > 0"><strong>{{ recVouchers[0].length }}</strong> vouchers waiting</div>
    </div>

</template>

<script>
import Store from '../store.js';
export default {
    name: 'profile',
    data: function() {
        return {
            selectedTrader: Store.trader,
            recVouchers : Store.recVouchers
        }
    },
    mounted: function() {
        Store.getRecVouchers();
    }
}
</script>
