<template>
    <main class="container" id="home">

        <div class="content">

            <h1>Hello, Steph.</h1>

            <p>You have added 30 valid vouchers.</p>

            <router-link v-bind:to="'/tap'" class="link"><button>Add vouchers</button></router-link>
            <router-link v-bind:to="'/send'" class="link"><button>Request payment</button></router-link>

            <transition name="fade"><router-view></router-view></transition>

        </div>

    </main>
</template>

<script>
export default {
  name: 'home'
}
</script>
