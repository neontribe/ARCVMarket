<template>

    <div id="app">
        <transition name="fade"><router-view></router-view></transition>
    </div>

</template>

<script>
import Store from './store.js';
export default {
    name: 'app'
}
</script>

<style lang="scss">
    @import "sass/app.scss";
</style>
