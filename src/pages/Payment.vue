<template>
    <div>
        <main class="container fullwidth" id="payment">
            <div class="content fullwidth">
                <div v-if="vouchersAdded">
                    <h1>
                        You can request payment for
                        <strong>{{ voucherCount }}</strong> voucher<span
                            v-if="voucherCount > 1"
                            >s</span
                        >.
                    </h1>

                    <div
                        v-on:click="collapsed = !collapsed"
                        class="expandable"
                        v-bind:class="{ expanded: !collapsed }"
                    >
                        <i class="fa fa-list" aria-hidden="true"></i>
                    </div>

                    <div
                        class="list-wrapper"
                        v-bind:class="{ 'is-collapsed': collapsed }"
                    >
                        <div
                            class="voucher-list"
                            id="registeredVouchers"
                            v-if="vouchersAdded"
                        >
                            <!-- Tab header -->
                            <div class="tab thead">
                                <label>
                                    <div class="row-code">
                                        <div>Voucher code</div>
                                        <div>Voucher added on</div>
                                    </div>
                                </label>
                            </div>

                            <!-- Tab row -->
                            <div
                                class="tab row"
                                v-for="(recVoucher, index) in recVouchers[0]"
                                :key="recVoucher.code"
                            >
                                <label>
                                    <div class="row-code">
                                        <div>
                                            {{ recVoucher.code }}
                                            <div class="icon">
                                                <a
                                                    v-on:click.prevent="
                                                        onDelete(
                                                            recVoucher,
                                                            index
                                                        )
                                                    "
                                                    title="Delete voucher code"
                                                    ><i
                                                        class="fa fa-trash"
                                                        aria-hidden="true"
                                                    ></i
                                                ></a>
                                            </div>
                                        </div>
                                        <div>{{ recVoucher.updated_at }}</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <transition name="fade">
                        <message
                            v-bind:text="message.text"
                            v-bind:state="message.state"
                        ></message>
                    </transition>

                    <button id="requestPayment" v-on:click="onRequestPayment">
                        Request payment
                    </button>
                </div>

                <div v-else>
                    <h1>
                        There are no vouchers to request payment for. Add some!
                    </h1>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import Store from "../store.js";
import constants from "../constants";
import messageMix from "../mixins/messageMixin";

export default {
    name: "payment",
    mixins: [messageMix],
    data: () => ({
        recVouchers: Store.trader.recVouchers,
        netMgr: Store.netMgr,
        collapsed: true,
    }),
    computed: {
        voucherCount: function () {
            return this.vouchersAdded ? this.recVouchers[0].length : 0;
        },
        vouchersAdded: function () {
            return this.recVouchers[0] && this.recVouchers[0].length > 0;
        },
        paymentMessage: function () {
            return Store.trader.market.payment_message
                ? Store.trader.market.payment_message
                : constants.copy.PAYMENT_REQUEST_DEFAULT;
        },
    },
    methods: {
        onRequestPayment() {
            document
                .getElementById("requestPayment")
                .setAttribute("disabled", "disabled");
            Store.pendRecVouchers(
                // on Success, route to /account
                () => {
                    this.setMessage(
                        this.paymentMessage,
                        constants.MESSAGE_SUCCESS
                    );
                    this.$router.message = this.message;
                    this.$router.push("/account");
                },
                // on Failure... hook for an alert?
                () => {
                    document
                        .getElementById("requestPayment")
                        .removeAttribute("disabled");
                    this.setMessage(
                        constants.copy.PAYMENT_REQUEST_ERROR,
                        constants.MESSAGE_ERROR
                    );
                }
            );
        },
        onDelete: function (recVoucher, index) {
            Store.delVoucher(
                recVoucher.code,
                () => {
                    this.$delete(Store.trader.recVouchers[0], index);
                    this.setMessage(
                        recVoucher.code + constants.copy.DELETE_VOUCHER_SUCCESS,
                        constants.MESSAGE_SUCCESS
                    );
                },
                () => {
                    this.setMessage(
                        recVoucher.code + constants.copy.DELETE_VOUCHER_FAIL,
                        constants.MESSAGE_ERROR
                    );
                }
            );
        },
    },
    mounted: function () {
        // initialise the current vouchers list;
        Store.maybeGetRecVouchers();
    },
};
</script>
