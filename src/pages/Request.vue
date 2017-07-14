<template>
    <div>

        <main class="container" id="request">

            <div class="content narrow">

                <h1>Reset your password</h1>

                <p>If you've forgotten your password, just enter your email address below and we'll send you a new password.</p>

                <div>
                    <form id="requestPassword">
                        <label for="userName">Your email address</label>
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
        name: 'request',
        data: function () {
            return {
                username: null
            }
        }
    }
</script>
