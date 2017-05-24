<template>
    <div>
        <header role="header">
            <logo></logo>
        </header>
        <main class="container" id="user">

            <div class="content narrow">

                <h1>Choose a trader account:</h1>

                <div class="form-group">

                    <div class="multiple-choice">
                        <input id="radio-1" type="radio" name="radio-group">
                        <label for="radio-1">{{ user1 }}</label>
                    </div>

                    <div class="multiple-choice">
                        <input id="radio-2" type="radio" name="radio-group">
                        <label for="radio-2">{{ user2 }}</label>
                    </div>

                    <div class="multiple-choice">
                        <input id="radio-3" type="radio" name="radio-group">
                        <label for="radio-3">{{ user3 }}</label>
                    </div>

                </div>

                <button id="submitVoucher">Log in as</button>

            </div>

        </main>
    </div>
</template>

<script>
import Logo from '../components/Logo.vue';
export default {
    name: 'user',
    data() {
        return {
            user1: "P and J Millward",
            user2: "Dave and Dave Ltd",
            user3: "Steve's Fruit and Veg",
        }
    },
    components: {
        Logo
    }
}
</script>
