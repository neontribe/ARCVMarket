<template>
    <footer>
        <p>&copy; Copyright {{ year }} Alexandra Rose Charity</p>
        <a href="https://www.alexandrarose.org.uk/privacy-policy-for-traders">
            Privacy Policy
        </a>
    </footer>
</template>

<script>
export default {
    name: "privacy-link",
    computed: {
        year() {
            return new Date().getFullYear();
        },
    },
};
</script>
