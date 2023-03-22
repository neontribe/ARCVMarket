<template>
    <button v-bind="$attrs" class="cta">
        <span class=""><slot /></span>
    </button>
</template>

<script>
export default {
    name: "AsyncButton",
    // forward any props through to the button.
    inheritAttrs: false,
    data: () => {
        return {};
    },
    computed: {},
    watch: {},
    methods: {},
};
</script>

<style scoped></style>
