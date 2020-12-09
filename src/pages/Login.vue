<template>
    <div>
        <main class="container" id="login">
            <div class="content narrow">
                <h1>Log In</h1>

                <transition name="fade">
                    <message
                        v-bind:text="message.text"
                        v-bind:state="message.state"
                    ></message>
                </transition>

                <div>
                    <form id="loginForm" v-on:submit.prevent="onLogin">
                        <label for="userName">Username</label>
                        <input
                            type="text"
                            v-model="username"
                            id="userName"
                            required
                        />
                        <label for="userPassword">Password</label>
                        <input
                            type="password"
                            v-model="password"
                            id="userPassword"
                            required
                        />
                        <button type="submit" value="Log In">Log In</button>
                    </form>

                    <div class="footer-links">
                        <div>
                            <router-link
                                v-bind:to="'/request'"
                                class="secondary"
                                >Forgot your password?</router-link
                            >
                        </div>
                        <div>
                            <router-link
                                v-bind:to="'/privacy-policy'"
                                class="secondary"
                                >Privacy Policy</router-link
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div class="build">
                <div class="version">{{ appV }}</div>
                <div class="commit" v-if="env === 'development'">
                    Commit: {{ commitMsg }}
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import Config from "../config.js";
import Store from "../store.js";

import mixin from "../mixins/mixins";
import constants from "../constants";

export default {
    name: "login",
    mixins: [mixin.messages],
    data: function () {
        return {
            username: null,
            password: null,
            remember: true,
            commitMsg: VERSION,
            appV: Config.appVersion,
            env: Config.env,
        };
    },
    methods: {
        /**
         * prods the store to make it login
         */
        onLogin: function () {
            const userApiCredentials = {
                username: this.username,
                password: this.password,
            };

            Store.authenticate(
                userApiCredentials,
                function () {
                    this.errorMessage = null;
                    // I don't like this here, but it's the only place it works for now.
                    let redirect = this.$route.query.redirect;
                    if (!redirect) {
                        redirect = "/";
                    }
                    this.$router.push({ path: redirect });
                }.bind(this),

                function (errMsg) {
                    this.setMessage(errMsg, constants.MESSAGE_ERROR);
                }.bind(this)
            );
        },
    },
};
</script>
