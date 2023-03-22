import AsyncButton from "../components/AsyncButton.vue";

const RESULT_TIMER = 3000;

export default {
    data: () => ({
        state: "",
    }),
    components: {
        AsyncButton,
    },
    methods: {
        startSpinner: function () {
            this.state = "spinner";
        },

        updateOp: function (operation, timer = RESULT_TIMER) {
            this.state = operation;
            setTimeout(() => {
                this.state = "";
            }, timer);
        },
    },
};
