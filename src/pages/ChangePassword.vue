<template>
    <div>

        <main class="container" id="changePassword">

            <div class="content narrow">

                <h1>Change your password</h1>

                <p>Please enter your new password below.</p>

                <div>
                    <form id="resetPassword" v-on:submit.prevent>
                        <message v-bind:text="message.text" v-bind:state="message.state"></message>
                        <label for="resetPassword">Reset password</label>
                        <input type="text" id="resetPassword" v-model="pwd" required>
                        <label for="confirmPassword">Confirm password</label>
                        <input type="text" id="confirmPassword" required>
                        <button type="submit" value="Request new password" v-model="pwdConfirm" v-on:click="onRequestChangePassword">Reset password</button>
                    </form>
                </div>

            </div>

        </main>

    </div>
</template>

<script>
    import Config from '../config.js';
    import Store from '../store.js';

    import mixin from '../mixins/mixins';
    import constants from "../constants";

    export default {
        name: 'changePassword',
        mixins: [
            mixin.messages
        ],
        data: function () {
            return {
                netMgr : Store.netMgr,
                pwd : "",
                pwdConfirm: ""
            }
        },
        methods: {
            onRequestChangePassword: function () {
                return this.netMgr.apiPost('user/lost_password/reset', {'password' : this.pwd},
                    function (response) {
                        this.setMessage(response, constants.MESSAGE_SUCCESS)
                    }.bind(this),
                    function (error) {
                        switch(this.pwd) {
                            case this.pwd.length < 6: 
                                this.setMessage(error.response.data.password[1], constants.MESSAGE_ERROR);
                                break;
                            case this.pwd !== this.pwdConfirm:
                                this.setMessage(error.response.data.password[0], constants.MESSAGE_ERROR);
                                break;
                            default:
                                this.setMessage("");
                        }
                    }.bind(this)
                )
            }
        }
    }
</script>
