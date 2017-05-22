<template>

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

            <div class="multiple-choice checkbox">
                <input type="checkbox" id="rememberMe" v-model="remember">
                <label for="rememberMe">Stay logged in</label>
            </div>

        </div>

    </main>
</template>

<script>
    import Vue from 'vue';
    import Router from 'vue-router';
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
            auth : function() {
                console.log("fire");
                Router.push('/tap');
            }
        },
        methods: {
            onLogin: function () {
                var userApiCreds = {
                    username: this.username,
                    password: this.password
                };
                console.log(this.auth);
                Store.authenticate(userApiCreds, function () {
                    console.log("token" + Store.netMgr.token);
                });
                console.log(this.auth);
            }
        }
    }
</script>
