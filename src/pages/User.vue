<template>
    <div>
        <header role="header">
            <logo></logo>
        </header>
        <main class="container" id="user">

            <div class="content narrow">

                <h1>Choose a trader account to act for:</h1>

                <div class="form-group" v-for="(trader, index) in userTraders">

                    <div class="multiple-choice">
                        <input :id="'radio-'+index" type="radio" name="radio-group">
                        <label :for="'radio-'+index">{{ trader }}</label>
                    </div>

                </div>

                <button id="submitVoucher">Continue</button>

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
            userTraders : Store.user.traders
        }
    },
    components: {
        Logo
    },
    mounted : function() {
        Store.getUserTraders();
    },
    methods : {

    }
}
</script>
