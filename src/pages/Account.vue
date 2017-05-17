<template id="account">
    <div>
        <masthead></masthead>
        <main class="container">

            <div class="content">

                <h1>Hello, Market Stall Name.</h1>

                <p>You have added 31 valid vouchers.</p>

                <router-link v-bind:to="'/tap'" class="link"><button>Add vouchers</button></router-link>
                <router-link v-bind:to="'/payment'" class="link"><button>Request payment</button></router-link>

                <transition name="fade"><router-view></router-view></transition>

            </div>

        </main>
    </div>
</template>

<script>
import Logo from '../components/Logo.vue';
import Masthead from '../components/Masthead.vue';
export default {
    name: 'account',
    components: {
        Logo,
        Masthead
    }
}
</script>
