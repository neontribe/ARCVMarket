<template>

    <div id="app">
        <masthead></masthead>
        <transition name="fade"><router-view></router-view></transition>
    </div>

</template>

<script>
import Masthead from './components/Masthead.vue';
import Store from './store.js';
export default {
    name: 'app',
    components: {
        Masthead
    }
}
</script>

<style lang="scss">
    @import "sass/app.scss";
</style>
