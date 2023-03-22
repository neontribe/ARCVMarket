const RESULT_TIMER = 2000;

export default {
    data: () => ({
        spinner: false,
        validate: false,
        fail: false,
        queued: false,
    }),
    methods: {
        startSpinner: function () {
            this.spinner = true;
        },

        updateOp: function (operation, timer = RESULT_TIMER) {
            operation = true;
            this.spinner = false;
            setTimeout(() => {
                operation = false;
            }, timer);
        },
    },
};
