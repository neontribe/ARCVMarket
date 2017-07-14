<template>
    <div>
        <main class="container fullwidth" id="payment">

            <div class="content fullwidth">
                <h1 v-if="vouchersAdded" v-on:click="collapsed = !collapsed" class="expandable" v-bind:class="{'expanded' : !collapsed}">You can request payment for <strong>{{ voucherCount }}</strong> voucher<span v-if="voucherCount > 1">s</span>.</h1>
                <h1 v-else>There are no vouchers to request payment for. Add some!</h1>

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

                <instructions></instructions>

                <transition name="fade">
                    <message :text="message.text" :state="message.state"></message>
                </transition>

                <button id="requestPayment" v-if="vouchersAdded" v-on:click="onRequestPayment">Request payment</button>

            </div>

        </main>
    </div>
</template>

<script>
import Store from '../store.js';
import mixin from '../mixins/mixins';
import Instructions from '../components/Instructions.vue';
import Message from '../components/Message.vue';
import NetMgr from '../services/netMgr.js';
import constants from '../constants';
const RESULT_TIMER = 5000;
export default {
    name: 'payment',
    components: {
        Instructions,
        Message
    },
    data() {
        return {
            recVouchers : Store.trader.recVouchers,
            collapsed : true,
            voucherCount : 0
        }
    },
    mixins: [
        mixin.messages
    ],
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
            this.setMessage("Thanks, your payment request has been sent.", constants.MESSAGE_SUCCESS);
            setTimeout(function() {
                this.$router.push('/account');
            }.bind(this), RESULT_TIMER);
        },
        onRequestPayment() {
            Store.pendRecVouchers(
                // on Success, route to /account
                function(response) {
                    this.showConfirmation();
                }.bind(this),
                // on Failure... hook for an alert?
                function(error) {
                    this.setMessage("There are a problem with your payment request, please try again later.", constants.MESSAGE_ERROR);
                }
            );
        }
    },
    mounted: function() {
        // initialise the current vouchers list;
        Store.getRecVouchers();
    }
}

</script>
