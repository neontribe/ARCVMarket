<template>
    <div>
        <main class="container fullwidth" id="payment">

            <div class="content fullwidth">

                <div v-if="vouchersAdded">

                    <h1>You can request payment for <strong>{{ voucherCount }}</strong> voucher<span v-if="voucherCount > 1">s</span>.</h1>

                    <div v-on:click="collapsed = !collapsed" class="expandable" v-bind:class="{'expanded' : !collapsed}"><i class="fa fa-list" aria-hidden="true"></i></div>

                    <div class="list-wrapper" v-bind:class="{'is-collapsed' : collapsed }">

                        <div class="voucher-list" id="registeredVouchers" v-if="vouchersAdded">

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
                            <div class="tab row" v-for="recVoucher in recVouchers[0]">
                                <label>
                                    <div class="row-code">
                                        <div>{{ recVoucher.code }}</div>
                                        <div>{{ recVoucher.updated_at }}</div>
                                    </div>
                                </label>
                            </div>

                        </div>

                    </div>

                    <transition name="fade">
                        <message v-bind:text="message.text" v-bind:state="message.state"></message>
                    </transition>

                    <button id="requestPayment" v-on:click="onRequestPayment">Request payment</button>

                </div>

                <div v-else><h1>There are no vouchers to request payment for. Add some!</h1></div>

            </div>

        </main>
    </div>
</template>

<script>
import Store from '../store.js';
import mixin from '../mixins/mixins';
import Message from '../components/Message.vue';
import NetMgr from '../services/netMgr.js';
import constants from '../constants';
export default {
    name: 'payment',
    data() {
        return {
            recVouchers : Store.trader.recVouchers,
            netMgr : Store.netMgr,
            collapsed : true,
            voucherCount : 0
        }
    },
    mixins: [
        mixin.messages
    ],
    components: {
        Message
    },
    computed: {
        vouchersAdded: function() {
            if (this.recVouchers[0] && this.recVouchers[0].length > 0) {
                this.voucherCount = this.recVouchers[0].length;
                return true;
            }
        }
    },
    methods: {
        showConfirmation: function() {
            this.setMessage("Thanks, your payment request has been sent. Please take your vouchers to your market representative for them to be sent off.", constants.MESSAGE_SUCCESS);
            this.$router.message = this.message;
            this.$router.push('/account');
        },
        onRequestPayment() {
            Store.pendRecVouchers(
                // on Success, route to /account
                function(response) {
                    this.showConfirmation();
                }.bind(this),
                // on Failure... hook for an alert?
                function(error) {
                    this.setMessage("There was a problem with your payment request, please try again later.", constants.MESSAGE_ERROR);
                }.bind(this)
            );
        }
    },
    mounted: function() {
        // initialise the current vouchers list;
        Store.getRecVouchers();
    }
}

</script>
