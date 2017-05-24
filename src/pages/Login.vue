<template>
    <div>
        <header role="header">
            <logo></logo>
        </header>

        <main class="container" id="login">

            <div class="content">

                <h1>Log In</h1>

                <div>
                    <form id="loginForm" v-on:submit.prevent="onLogin">
                        <ul>
                            <label for="userName">Username</label>
                            <input type="text" v-model="username" id="userName" required>
                            <label for="userPassword">Password</label>
                            <input type="password" v-model="password" id="userPassword" required>
                            <button type="submit" value="Log In">Log In</button>
                        </ul>
                    </form>
                </div>

            </div>

        </main>

    </div>
</template>

<script>
    import Logo from '../components/Logo.vue';
    import Store from '../store.js';


    export default {
        name: 'login',
        components: {
            Logo
        },
        data: function () {
            return {
                username: null,
                password: null,
                remember: true
            }
        },
        methods: {
            /**
             * prods the store to make it login
             */
            onLogin: function () {
                var userApiCreds = {
                    username: this.username,
                    password: this.password
                };
                Store.authenticate(userApiCreds, function () {
                    // I don't like this here, but it's the only place it works for now.

                    var redirect = this.$route.query.redirect;
                    console.log(redirect);
                    if (!redirect) {
                        redirect = '/tap';
                    }

                    this.$router.push({path: redirect});

                }.bind(this));

            }
        }
    }
</script>
