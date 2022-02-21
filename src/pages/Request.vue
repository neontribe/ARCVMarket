<template>
    <div>
        <main class="container" id="request">
            <div class="content narrow">
                <h1>Reset your password</h1>

                <p>
                    If you've forgotten your password, just enter your email
                    address below and we'll send you a new password.
                </p>

                <div>
                    <form id="requestPassword" v-on:submit.prevent>
                        <message
                            v-bind:text="message.text"
                            v-bind:state="message.state"
                        ></message>
                        <label for="userName">Your email address</label>
                        <input
                            type="text"
                            v-model="username"
                            id="userName"
                            required
                        />
                        <button
                            type="submit"
                            value="Request new password"
                            v-on:click="onRequestResetEmail"
                        >
                            Request new password
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
    name: "request",
    mixins: [mixin.messages],
    data: function () {
        return {
            username: null,
            netMgr: Store.netMgr,
        };
    },
    methods: {
        isEmailValid: function (email) {
            // Email address regex.
            const re =
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return re.test(email);
        },
        onRequestResetEmail: function () {
            if (this.isEmailValid(this.username)) {
                return this.netMgr.apiPost(
                    "user/lost_password",
                    { email: this.username },

                    function (response) {
                        this.setMessage(
                            response.data.status,
                            constants.MESSAGE_SUCCESS
                        );
                    }.bind(this),
                    function (error) {
                        // "Invalid email addresses" errors come back as an array, for some reason.
                        this.setMessage(
                            error.response.data.email.toString(),
                            constants.MESSAGE_ERROR
                        );
                    }.bind(this)
                );
            } else {
                this.setMessage(
                    "Please enter a valid email address.",
                    constants.MESSAGE_ERROR
                );
            }
        },
    },
};
</script>
