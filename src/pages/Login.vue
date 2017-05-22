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
                        <button type="submit" class="smaller" value="Log In">Log In</button>
                    </ul>
                </form>
            </div>

            <div class="multiple-choice checkbox">
                <input type="checkbox" id="rememberMe" v-model="remember">
                <label for="rememberMe">Stay logged in</label>
            </div>

        </div>

    </main>
    
    </div>
</template>

<script>
    import Store from '../store.js';

    export default {
        name: 'login',
        data: function () {
            return {
                username: null,
                password: null,
                remember: true,
                auth: Store.auth
            }
        },
        watch: {
            /**
             *  Watches this.auth to check for changes
             */
            auth : function(val) {
                if (this.auth) {
                    // This function fires but router doesn't appear to be doing anything...
                    // ther must be scope thing going on
                    // router.push('/tap');
                }
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
                    this.auth = true;
                }.bind(this));

            }
        }
    }
</script>
