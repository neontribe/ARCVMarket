<template id="profile">

    <div class="profile-bar">
        <div><router-link v-bind:to="'/account'"><strong>{{ selectedTrader.name }}</strong></router-link> <router-link v-bind:to="'/user'">(Change trader)</router-link></div>
        <a v-on:click="onLogout">Log out</a>
    </div>

</template>

<script>
import Store from '../store.js';
export default {
    name: 'profile',
    data: function() {
        return {
            selectedTrader : Store.trader
        }
    },
    methods: {
        onLogout : function() {
            Store.unAuthenticate();
            this.$router.push('/login');
        }
    }
}
</script>
