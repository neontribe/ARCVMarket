<template id="masthead">

    <div class="wrapper">

        <header role="header">
            <div class="logo">
                <router-link v-bind:to="'/'" class="link"><img src="../assets/logo.png"></router-link>
            </div>

            <nav role="navigation">
                <ul>
                    <li><router-link v-bind:to="'/'"><i class="fa fa-keyboard-o" aria-hidden="true"></i><br />Add Voucher</router-link></li>
                    <li><router-link v-bind:to="'/payment'"><i class="fa fa-rocket" aria-hidden="true"></i><br />Queued<br />Vouchers</router-link></li>
                    <li><router-link v-bind:to="'/account'"><i class="fa fa-user" aria-hidden="true"></i><br />My<br />Account</router-link></li>
                </ul>
            </nav>

        </header>

        <profile></profile>

        <transition name="fade"><toolbar></toolbar></transition>

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
    }
}
</script>
