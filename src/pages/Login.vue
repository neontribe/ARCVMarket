<template>

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

            <div class="multiple-choice checkbox">
                <input type="checkbox" id="rememberMe" value="false">
                <label for="rememberMe">Stay logged in</label>
            </div>

        </div>

    </main>
</template>

<script>
export default {
  name: 'login'
}
</script>
