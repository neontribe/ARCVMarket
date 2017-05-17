<template>
    <div>
        <header role="header">
            <logo></logo>
        </header>
        <main class="container" id="login">

            <div class="content">

                <h1>Log In</h1>

                <div>
                    <form>
                        <ul>
                            <label for="userName">Username</label>
                            <input type="text" id="userName" required>
                            <label for="userPassword">Password</label>
                            <input type="password" id="userPassword" required>
                            <button type="submit" value="Log In">Log In</button>
                        </ul>
                    </form>
                </div>

            </div>

        </main>
    </div>
</template>

<script>
import Logo from '../components/Logo.vue';
export default {
    name: 'login',
    components: {
        Logo
    }
}
</script>
