<template>
    <div>

        <main class="container" id="changePassword">

            <div class="content narrow">

                <h1>Change your password</h1>

                <p>You have requested to change the password for { email address }.</p>

                <div>
                    <form id="resetPassword" v-on:submit.prevent="onLogin">
                        <label for="userName">New password</label>
                        <input type="text" v-model="username" id="userName" required>
                        <button type="submit" value="Request new password">Request new password</button>
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
                username: null
            }
        }
    }
</script>
