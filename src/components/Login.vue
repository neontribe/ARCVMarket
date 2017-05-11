<!-- Login page in progress -->
<template>
    <main class="container" id="login">

        <div class="content">

            <h1>Log In</h1>

            <div>
                <form>
                    <ul>
                        <label for="usermail">Username</label>
                        <input type="email" name="usermail" required>
                        <label for="password">Password</label>
                        <input type="password" name="password" required>
                        <button type="submit" value="Log In">Log In</button>
                    </ul>
                </form>
            </div>

        </div>

    </main>
</template>

<script>
export default {
  name: 'login'
}
</script>
