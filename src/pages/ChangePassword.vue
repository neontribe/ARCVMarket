<template>
    <div>

        <main class="container" id="changePassword">

            <div class="content narrow">

                <h1>Change your password</h1>

                <p>Please enter your new password below.</p>

                <div>
                    <form id="resetPassword">
                        <label for="userName">Reset password</label>
                        <input type="text" id="userName" required>
                        <label for="userName">Confirm password</label>
                        <input type="text" id="userName" required>
                        <button type="submit" value="Request new password">Reset password</button>
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
