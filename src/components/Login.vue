<template>
  <main class="container" id="login">

    <h1>Log In</h1>

    <div id="input">
      <form name="login" action="index_submit" method="get" accept-charset="utf-8">
        <ul>
          <label for="usermail">Username</label>
          <input type="email" name="usermail" required>
          <label for="password">Password</label>
          <input type="password" name="password" required>
          <button type="submit" value="Log In">Log In</button>
        </ul>
      </form>
    </div>

  </main>
</template>

<script>
export default {
  name: 'login'
}
</script>
