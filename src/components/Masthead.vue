<template>

    <header role="header" id="masthead">
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

</template>

<script>
export default {
    name: 'masthead'
}
</script>
