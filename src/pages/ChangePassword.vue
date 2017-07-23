<template>
    <div>

        <main class="container" id="changePassword">

            <div class="content narrow">

                <h1>Change your password</h1>

                <p>Please enter your new password below.</p>

                <div>
                    <form id="resetPassword" v-on:submit.prevent>
                        <label for="resetPassword">Reset password</label>
                        <input type="text" id="resetPassword" required>
                        <label for="confirmPassword">Confirm password</label>
                        <input type="text" id="confirmPassword" v-model="pwd" required>
                        <button type="submit" value="Request new password" v-on:click="onRequestChangePassword">Reset password</button>
                    </form>
                </div>

            </div>

        </main>

    </div>
</template>

<script>
    import Config from '../config.js';
    import Store from '../store.js';
    export default {
        name: 'changePassword',
        data: function () {
            return {
                netMgr : Store.netMgr,
                pwd : ""
            }
        },
        methods: {
            onRequestChangePassword: function () {
                return this.netMgr.apiPost('user/lost_password/reset', {'password' : this.pwd},
                      function (response) {
                          if (success) {success(response)}
                      },
                      function (error) {
                          if (failure) {failure(error)}
                      }
                )
            }
        }
    }
</script>
