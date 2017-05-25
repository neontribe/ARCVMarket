<template id="profile">

    <div class="profile-bar">
        <div v-if="recVouchers[0] && recVouchers[0].length > 0"><strong>{{ recVouchers[0].length }}</strong> vouchers waiting</div>
        <div>Logged in as <router-link v-bind:to="'/account'">P &amp; J Millward</router-link></div>
    </div>

</template>

<script>
import Store from '../store.js';
export default {
    name: 'profile',
    data: function() {
        return {
            recVouchers : Store.recVouchers
        }
    },
    mounted: function() {
        Store.getRecVouchers();
    }
}
</script>
