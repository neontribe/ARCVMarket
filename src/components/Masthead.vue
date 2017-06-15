<template id="masthead">

    <div class="wrapper">

        <header role="header">
            <div class="logo" v-bind:class="{ login : $route.path==='/login' || $route.path==='/user' }">
                <router-link v-if="!($route.path==='/login' || $route.path==='/user')" v-bind:to="'/'" class="link"><img src="../assets/logo.png" alt="Rose Vouchers Fruit And Veg Logo"></router-link>
                <img v-else src="../assets/logo.png" alt="Rose Vouchers Fruit And Veg Logo">
            </div>

            <nav role="navigation" v-if="headerFull">
                <ul>
                    <li><router-link v-bind:to="'/'"><i class="fa fa-keyboard-o" aria-hidden="true"></i><br />Add Voucher</router-link></li>
                    <li><router-link v-bind:to="'/payment'"><i class="fa fa-rocket" aria-hidden="true"></i><br />Get<br />Payment</router-link></li>
                    <li><router-link v-bind:to="'/account'"><i class="fa fa-user" aria-hidden="true"></i><br />My<br />Account</router-link></li>
                </ul>
            </nav>

        </header>

        <profile v-if="headerFull"></profile>
        <toolbar v-if="toolbarShow"></toolbar>

    </div>

</template>

<script>
import Profile from '../components/Profile.vue';
import Toolbar from '../components/Toolbar.vue';
export default {
    name: 'masthead',
    components: {
        Profile,
        Toolbar
    },
    computed : {
        headerFull : function() {
            var paths = [
              "/login",
              "/user"
            ];
            return (paths.indexOf(this.$route.path) === -1);
        },
        toolbarShow : function() {
            var paths = [
              "/",
              "/scan",
              "/upload"
            ];
            return !(paths.indexOf(this.$route.path) === -1);
        }
    }
}
</script>
