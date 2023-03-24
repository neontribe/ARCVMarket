<template>
    <button
        class="cta"
        v-bind:class="state"
        :disabled="state !== ''"
        @click="onClick"
    >
        <span v-if="state === ''" class=""><slot /></span>
        <span v-if="state === 'spinner'" class="">Please wait...</span>
    </button>
</template>

<script>
export default {
    name: "async-button",
    props: {
        onClick: { type: Function, required: true },
        state: String,
    },
    data: () => {
        return {};
    },
    computed: {},
    watch: {},
    methods: {},
};
</script>

<style lang="scss" scoped>
@import "../sass/vars";
.spinner,
.validate,
.fail,
.queued {
    color: $arc_white;
    &:before {
        font-size: 1.5em;
        font-family: FontAwesome, serif;
    }
}
.spinner {
    position: relative;
    background: $arc_rose;
    &:before {
        position: absolute;
        animation: fa-spin 2s infinite linear;
        top: 11px;
        left: 6em;
        right: 0;
        margin: 0 auto;
        content: "\f013";
    }
}
.validate {
    background: $arc_success;
    &:before {
        content: "\f00c";
    }
}
.fail {
    background: $arc_error;
    &:before {
        content: "\f00d";
    }
}
.queued {
    background: $arc_warning;
    &:before {
        content: "\f017";
    }
}
</style>
