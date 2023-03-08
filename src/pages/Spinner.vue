<template id="spinner">
    <div v-if="active" class="spinner-wrapper">
        <div class="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <p>{{ text }}</p>
    </div>
</template>

<script>
export default {
    name: "Spinner",
    props: {
        active: Boolean,
        text: String,
    },
    data: function () {
        return {};
    },
};
</script>
