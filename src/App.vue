<template>

    <div id="app">

        <header role="header">
            <router-link v-bind:to="'/'" class="link"><img src="./assets/logo.png"></router-link>
            <router-link v-bind:to="'/'" class="link">
                <div class="counter">
                    <span class="total">31</span>
                    <br />vouchers<br />waiting
                </div>
            </router-link>
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
/* Copyright (c) 2017, Alexander Rose Charity (reg. in England and Wales, #00279157) */
import Store from './store.js';

export default {
    name: 'app'
}
</script>

<style lang="scss">
    @import "sass/app.scss";
</style>
