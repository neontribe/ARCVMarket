<template id="queue">
    <transition name="fade" v-if="currentlyShown">
        <div class="content narrow queuedVouchers">
            <h1>Queued vouchers</h1>

            <message
                v-bind:text="message.text"
                v-bind:state="message.state"
            ></message>
            <async-button
                id="submit-voucher"
                v-bind:state="state"
                :onClick="onSubmitQueue"
            >
                Resubmit Queued Vouchers
            </async-button>
            <div
                v-on:click="collapsed = !collapsed"
                class="expandable queue"
                v-bind:class="{ expanded: !collapsed }"
            >
                <i class="fa fa-list" aria-hidden="true"></i>
            </div>
            <div
                class="list-wrapper"
                v-bind:class="{ 'is-collapsed': collapsed }"
            >
                <div class="voucher-list">
                    <!-- Tab header -->
                    <div class="tab thead">
                        <label>
                            <div class="row-code">
                                <div>Voucher code</div>
                            </div>
                        </label>
                    </div>

                    <!-- Tab row -->
                    <div
                        class="tab row"
                        v-for="voucher in vouchers"
                        :key="voucher.code"
                    >
                        <label>
                            <div class="row-code">
                                <div>{{ voucher.code }}</div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Store from "../store.js";

import constants from "../constants";
import MessageMixin from "../mixins/MessageMixin";
import AsyncButtonMixin from "../mixins/AsyncButtonMixin";

const RESULT_TIMER = 3000;

export default {
    name: "queue",
    mixins: [MessageMixin, AsyncButtonMixin],
    data: function () {
        return {
            queue: Store.queue,
            collapsed: true,
            show: true,
            netMgr: Store.netMgr,
            vouchers: Store.trader.vouchers,
        };
    },
    created: function () {
        this.message.text = this.queueStatus;
    },
    watch: {
        queue: {
            handler: function (val) {
                // Because we submit cached queued vouchers on reload in store we need to watch the status of this..
                // so that we can reflect any changes in the Queue component.
                const queueState = val.sendingStatus;
                if (!queueState && val.sentData) {
                    const message = val.sentData.data.message;
                    this.updateOp("validate", RESULT_TIMER);
                    this.emitMessage(message, constants.MESSAGE_SUCCESS);
                } else if (!queueState) {
                    this.state = "";
                }
            },
            deep: true,
        },
        vouchers: function () {
            this.setMessage(this.queueStatus, constants.MESSAGE_STATUS);
        },
    },
    mounted: function () {
        if (this.queue.sendingStatus) {
            this.startSpinner();
        }
    },
    computed: {
        currentlyShown: function () {
            return (
                this.vouchers.length >= 1 && !Store.getVouchersOnlineStatus()
            );
        },
        queueStatus: function () {
            const pluralise = this.vouchers.length !== 1 ? "s" : "";
            return (
                "You have <strong>" +
                this.vouchers.length +
                "</strong> voucher" +
                pluralise +
                " in your queue. Queued vouchers will be checked when you submit your queue."
            );
        },
    },
    methods: {
        onSubmitQueue: function () {
            this.startSpinner();

            Store.transitionVouchers(
                "collect",
                Store.getTraderVoucherList(),
                (response) => {
                    // The server has processed our list, clear it.
                    Store.clearVouchers();
                    Store.getRecVouchers();

                    let message = "";
                    let messageType = constants.MESSAGE_SUCCESS;

                    // We need to check warning because a queue can contain just one voucher.
                    if (response.data.warning) {
                        message = response.data.warning;
                        messageType = constants.MESSAGE_WARNING;
                    } else if (response.data.message) {
                        message = response.data.message;
                    }
                    this.updateOp("validate", RESULT_TIMER);
                    this.emitMessage(message, messageType);
                },
                () => {
                    this.updateOp("fail", RESULT_TIMER);
                    this.emitMessage(
                        constants.copy.QUEUE_NETWORK_ERROR,
                        constants.MESSAGE_ERROR
                    );
                }
            );
        },
    },
};
</script>
