<template>
    <div>

        <main class="container" id="user">

            <div class="content narrow">

                <h1>Choose a trader to manage</h1>

                <form id="frmChooseTrader" v-on:submit.prevent >

                    <div class="form-group" v-for="(trader, index) in this.userTraders[0]">
                        <div class="multiple-choice">
                            <input :id="'radio-'+index" :value="trader.id" v-model="checked" type="radio" name="radio-group">
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
import Store from "../store.js";
export default {
    name: 'user',
    data() {
        return {
            userTraders: Store.user.traders,
            checked : [] // Is at least one radio button clicked.
        }
    },
    mounted : function() {
        Store.getUserTraders();
    },
    methods : {
        onContinue : function() {
            if (Store.setUserTrader(this.checked)) {
                var redirect = this.$route.query.redirect;
                if (!redirect) {
                    redirect = '/';
                }
                this.$router.push({path: redirect});
            }
        }

    }
}
</script>
