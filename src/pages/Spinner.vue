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

<style lang="scss" scoped>
p {
    font-size: 0.8em;
    font-weight: 300;
    margin-top: 5px;
    letter-spacing: 1px;
    color: rgb(82, 82, 82);
}

.spinner-wrapper {
    text-align: center;
}

.spinner {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}
.spinner div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #6916a0;
    border-radius: 50%;
    animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #6916a0 transparent transparent transparent;
}
.spinner div:nth-child(1) {
    animation-delay: -0.45s;
}
.spinner div:nth-child(2) {
    animation-delay: -0.3s;
}
.spinner div:nth-child(3) {
    animation-delay: -0.15s;
}
@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
