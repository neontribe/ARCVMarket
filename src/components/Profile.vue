<template id="profile">
    <div class="profile-bar">
        <div>
            <strong>{{ selectedTrader.name }}</strong>
            <router-link v-bind:to="'/user'" v-if="changeTrader"
                >(Change trader)</router-link
            >
        </div>
        <a v-on:click="onLogout">Log out</a>
    </div>
</template>

<script>
import Store from "../store.js";
export default {
    name: "profile",
    data: function () {
        return {
            selectedTrader: Store.trader,
            userTraders: Store.user.traders,
        };
    },
    computed: {
        changeTrader: function () {
            return this.userTraders[0] && this.userTraders[0].length > 1;
        },
    },
    methods: {
        onLogout: function () {
            Store.unAuthenticate();
            // Artificially using a HTTP code to set to 200 for "Ok, I did that"
            const routeObj = { name: "login", params: { logoutReason: 200 } };
            this.$router.push(routeObj);
        },
    },
    mounted: function () {
        Store.getUserTraders();
    },
};
</script>
