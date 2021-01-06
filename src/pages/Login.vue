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
                            <a
                                href="https://www.alexandrarose.org.uk/privacy-policy-for-traders"
                                class="secondary"
                                id="privacy"
                                >Privacy Policy</a
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
    props: ["logoutReason"],
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
    mounted: function () {
        if (this.logoutReason) {
            let msg = "";
            let state = constants.MESSAGE_ERROR;
            switch (this.logoutReason) {
                // Normal logout
                case 200:
                    msg = constants.copy.USER_LOGOUT;
                    state = constants.MESSAGE_SUCCESS;
                    break;
                // Refresh token failed
                case 401:
                    msg = constants.copy.TIMEOUT_LOGOUT;
                    state = constants.MESSAGE_WARNING;
                    break;
                // Access forbidden, Trader probably disabled for that User
                case 403:
                    msg = constants.copy.FORCED_LOGOUT;
                    state = constants.MESSAGE_WARNING;
                    break;
                default:
                    msg = constants.copy.UNKNOWN_EVENT;
            }
            this.setMessage(msg, state);
        }
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
