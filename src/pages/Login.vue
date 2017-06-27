<template>
    <div>

        <main class="container" id="login">

            <div class="content narrow">

                <h1>Log In</h1>

                <transition name="fade"><div v-if="errorMessage" class="message">{{ errorMessage }}</div></transition>

                <div>
                    <form id="loginForm" v-on:submit.prevent="onLogin">
                        <label for="userName">Username</label>
                        <input type="text" v-model="username" id="userName" required>
                        <label for="userPassword">Password</label>
                        <input type="password" v-model="password" id="userPassword" required>
                        <button type="submit" value="Log In">Log In</button>
                    </form>
                </div>

            </div>

            <div class="build">
                <span class="version"> {{ appV }}</span>
                <span class="commit" v-if="env === 'development'"> Commit : {{ commitmsg }}</span>
            </div>

        </main>

    </div>
</template>

<script>
    import Config from '../config.js';
    import Store from '../store.js';
    export default {
        name: 'login',
        data: function () {
            return {
                username: null,
                password: null,
                remember: true,
                errorMessage : Store.error,
                commitmsg: VERSION,
                appV: Config.appVersion,
                env: Config.env
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
                    this.errorMessage = null;
                    // I don't like this here, but it's the only place it works for now.
                    var redirect = this.$route.query.redirect;
                    if (!redirect) {
                        redirect = '/';
                    }

                    this.$router.push({path: redirect});

                }.bind(this),
                function (errmsg) {
                  this.errorMessage = errmsg;
                }.bind(this)
              );

            }
        }
    }
</script>
