<template>
    <div>

        <main class="container" id="request">

            <div class="content narrow">

                <h1>Reset your password</h1>

                <p>If you've forgotten your password, just enter your email address below and we'll send you a new password.</p>

                <div>
                    <form id="requestPassword" v-on:submit.prevent>
                        <label for="userName">Your email address</label>
                        <input type="text" v-model="username" id="userName" required>
                        <button type="submit" value="Request new password" v-on:click="onRequestResetEmail">Request new password</button>
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
        name: 'request',
        data: function () {
            return {
                username: null,
                netMgr: Store.netMgr
            }
        },
        methods: {
            onRequestResetEmail: function () {
                return this.netMgr.apiPost('user/lost_password', {'email' : this.username},
                    function (response) {
                        if (success) {success(response)}
                    },
                    function (error) {
                        if (failure) {failure(error)}
                    }
                );
            }
        }
    }
</script>
