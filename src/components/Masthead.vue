<template id="masthead">

  <div>

    <header role="header">
        <div class="logo">
            <router-link v-bind:to="'/'" class="link"><img src="../assets/logo.png"></router-link>
        </div>

        <nav role="navigation">
            <ul>
                <li><router-link v-bind:to="'/tap'"><i class="fa fa-keyboard-o" aria-hidden="true"></i><br />Add Voucher</router-link></li>
                <li><router-link v-bind:to="'/payment'"><i class="fa fa-rocket" aria-hidden="true"></i><br />Get Payment</router-link></li>
                <li><router-link v-bind:to="'/account'"><i class="fa fa-user" aria-hidden="true"></i><br />My<br />Account</router-link></li>
            </ul>
        </nav>
    </header>

    <nav role="navigation" class="input-tab" v-if="($route.path==='/' || $route.path==='/tap' || $route.path==='/scan' || $route.path==='/upload') ? true : false">
        <ul>
            <router-link v-bind:to="'/tap'">Type</router-link>
            <router-link v-bind:to="'/scan'">Scan</router-link>
            <router-link v-bind:to="'/upload'">Upload</router-link>
        </ul>
    </nav>

  </div>

</template>

<script>
export default {
    name: 'masthead'
}
</script>
