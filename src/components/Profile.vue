<template id="profile">

    <div class="profile-bar">
        <div><strong>2</strong> vouchers added</div>
        <div>Managing <router-link v-bind:to="'/user'">{{ selectedTrader.name }}</router-link></div>
    </div>

</template>

<script>
import Store from '../store.js';
export default {
    name: 'profile',
    data() {
        return {
            selectedTrader: Store.trader
        }
    },
    created : function() {
        console.log(this.selectedTrader);
    }
}
</script>
