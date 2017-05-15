<template>

    <div id="app">

        <header role="header">
            <div class="header-container">
                <router-link v-bind:to="'/'" class="link"><img src="./assets/logo.png"></router-link>
                <router-link v-bind:to="'/'" class="link">
                    <div class="counter">
                        <div class="total">31</div>
                        <div class="counter-text">vouchers<br />waiting</div>
                    </div>
                </router-link>
            </div>
        </header>

        <nav role="navigation">
            <ul>
                <li><router-link v-bind:to="'/'"><i class="fa fa-home" aria-hidden="true"></i><br />Home</router-link></li>
                <li><router-link v-bind:to="'/tap'"><i class="fa fa-keyboard-o" aria-hidden="true"></i><br />Tap</router-link></li>
                <li><router-link v-bind:to="'/scan'"><i class="fa fa-barcode" aria-hidden="true"></i><br />Scan</router-link></li>
                <li><router-link v-bind:to="'/send'"><i class="fa fa-paper-plane" aria-hidden="true"></i><br />Send</router-link></li>
            </ul>
        </nav>

        <router-link v-bind:to="'/login'"></router-link>

        <transition name="fade"><router-view></router-view></transition>

    </div>

</template>

<script>
import Store from './store.js';

export default {
    name: 'app'
}
</script>

<style lang="scss">
    @import "sass/app.scss";
</style>
