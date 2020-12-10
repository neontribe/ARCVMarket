import constants from "../constants";

import Message from "../components/Message.vue";

export default {
    data() {
        return {
            message: {
                state: constants.MESSAGE_STATUS,
                text: "",
            },
        };
    },

    components: {
        Message,
    },

    methods: {
        setMessage(text, state) {
            this.message.text = text;
            this.message.state = state;
        },
        emitMessage(text, state, eventName = "message-update") {
            this.$emit(eventName, text, state);
        },
    },
};
