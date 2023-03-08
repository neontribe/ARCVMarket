import Spinner from "../pages/Spinner.vue";

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
