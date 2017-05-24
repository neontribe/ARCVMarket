<template id="masthead">

  <div>

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

    <nav role="navigation" v-if="($route.path==='/' || $route.path==='/scan' || $route.path==='/upload') ? true : false">
        <ul>
            <router-link v-bind:to="'/'"><li>Type</li></router-link>
            <router-link v-bind:to="'/scan'"><li>Scan</li></router-link>
            <router-link v-bind:to="'/upload'"><li>Upload</li></router-link>
        </ul>
    </nav>

  </div>

</template>

<script>
import Profile from '../components/Profile.vue';
export default {
    name: 'masthead',
    components: {
        Profile
    }
}
</script>
