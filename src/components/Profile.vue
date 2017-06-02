<template id="profile">

    <div class="profile-bar">
        <div><strong>{{ selectedTrader.name }}</strong> <router-link v-bind:to="'/user'" v-if="changeTrader">(Change trader)</router-link></div>
        <a v-on:click="onLogout">Log out</a>
    </div>

</template>

<script>
import Store from '../store.js';
export default {
    name: 'profile',
    data: function() {
        return {
            selectedTrader : Store.trader,
            userTraders: Store.user.traders
        }
    },
    computed : {
        changeTrader: function() {
            return (this.userTraders[0] && this.userTraders[0].length > 1);
        }
    },
    methods: {
        onLogout : function() {
            Store.unAuthenticate();
            this.$router.push('/login');
        }
    },
    mounted : function() {
        Store.getUserTraders();
    }
}
</script>
