<template>
    <div>
        <header role="header">
            <logo></logo>
        </header>
        <main class="container" id="user">

            <div class="content narrow">

                <form id="frmTrader" v-on:submit.prevent>

                <h1>Choose a trader to manage</h1>

                <div class="form-group" v-for="(trader, index) in this.userTraders[0]">
                    <div class="multiple-choice">
                        <input :id="'radio-'+index" :value="trader" v-model="selectedTrader" type="radio" name="radio-group">
                        <label :for="'radio-'+index">{{ trader.name }}</label>
                    </div>
                </div>

                <button id="submitVoucher" v-on:click="onContinue">Continue</button>

                </form>

            </div>

        </main>
    </div>
</template>

<script>
import Logo from '../components/Logo.vue';
import Store from "../store.js";
export default {
    name: 'user',
    data() {
        return {
            userTraders: Store.user.traders,
            selectedTrader: Store.trader
        }
    },
    components: {
        Logo
    },
    watch: {
        selectedTrader: function(val) {
            console.log(val);
        }
    },
    mounted : function() {
        Store.getUserTraders();
    },
    methods : {
        onContinue : function() {
            var redirect = this.$route.query.redirect;
            if (!redirect) {
                redirect = '/';
            }
            this.$router.push({path: redirect});
        }
    }
}
</script>
