<template>
    <div>
        <main class="container" id="changePassword">
            <div class="content narrow">
                <h1>Change your password</h1>

                <p>Please enter your new password below.</p>

                <div>
                    <form id="resetPasswordForm" v-on:submit.prevent>
                        <message
                            v-bind:text="message.text"
                            v-bind:state="message.state"
                        ></message>
                        <label for="resetPassword">Reset password</label>
                        <input
                            type="password"
                            id="resetPassword"
                            v-model="pwd"
                            required
                        />
                        <label for="confirmPassword">Confirm password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            v-model="pwdConfirm"
                            required
                        />
                        <button
                            type="submit"
                            value="Request new password"
                            v-on:click="onRequestChangePassword"
                        >
                            Reset password
                        </button>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import Store from "../store.js";
import mixin from "../mixins/mixins";
import constants from "../constants";

export default {
    name: "changePassword",
    mixins: [mixin.messages],
    data: function () {
        return {
            netMgr: Store.netMgr,
            pwd: "",
            pwdConfirm: "",
            email: this.$route.query.email,
            token: this.$route.query.token,
        };
    },
    methods: {
        onRequestChangePassword: function () {
            return this.netMgr.apiPost(
                "user/lost_password/reset",
                {
                    password: this.pwd,
                    password_confirmation: this.pwdConfirm,
                    email: this.email,
                    token: this.token,
                },
                function () {
                    // Assumes this is a success.
                    this.$router.push("/");
                }.bind(this),
                function (error) {
                    // This only shows the *first* error. User will have to resolve multiple errors in turn.
                    this.setMessage(
                        error.response.data.password[0],
                        constants.MESSAGE_ERROR
                    );
                }.bind(this)
            );
        },
    },
};
</script>
