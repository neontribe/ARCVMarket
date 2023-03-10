import Spinner from "../components/Spinner.vue";

export default {
    data: () => {
        return {
            spinnerActive: false,
        };
    },

    components: {
        Spinner,
    },

    methods: {
        showSpinner() {
            this.spinnerActive = true;
        },
        hideSpinner() {
            this.spinnerActive = false;
        },
    },
};
