<template id="toolbar">

    <div class="toolbar">
        <router-link v-bind:to="'/'"><i class="fa fa-keyboard-o" aria-hidden="true"></i></router-link>
        <router-link v-bind:to="'/scan'"><i class="fa fa-camera" aria-hidden="true"></i></router-link>
        <router-link v-bind:to="'/upload'"><i class="fa fa-upload" aria-hidden="true"></i></router-link>
    </div>

</template>

<script>
export default {
    name: 'toolbar'
}
</script>
