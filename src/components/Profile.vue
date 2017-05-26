<template id="profile">

    <div class="profile-bar">
        <div v-if="recVouchers[0] && recVouchers[0].length > 0"><strong>{{ recVouchers[0].length }}</strong> vouchers waiting</div>
        <div>Logged in as <router-link v-bind:to="'/user'"> {{ selectedTrader.name }} </router-link></div>
    </div>

</template>

<script>
import Store from '../store.js';
export default {
    name: 'profile',
    data() {
        return {
            recVouchers : Store.recVouchers,
            selectedTrader: Store.trader
        }
    },
    mounted: function() {
        Store.getRecVouchers();
    }
}
</script>
