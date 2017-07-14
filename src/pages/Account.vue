<template>
    <div>
        <main class="container fullwidth" id="account">

            <div class="content fullwidth">
                <h1>Requested Payments</h1>

                <transition name="fade">
                    <message v-bind:text="message.text" v-bind:state="message.state"></message>
                </transition>

                <div v-if="voucherPayments.length > 0">

                    <div>
                        <p>[xXx]Click the <span class="list-icon"><i class="fa fa-list" aria-hidden="true"></i></span> icon below to view a payment record in more detail.</p>
                        <p>[xXx]To email yourself a specific payment record from the table below, select it and click 'Email selected payment record'.</p>
                        <p>[xXx]Or, to email yourself all of your payment records, just click 'Email all payment records'.</p>
                    </div>

                    <div class="accordion">

                        <!-- Tab header -->
                        <div class="tab thead">
                            <div class="row">
                                <div></div>
                                <div class="date"></div>
                                <div class="total"></div>
                                <div>Amount</div>
                                <div class="select-record"></div>
                            </div>
                        </div>

                        <div class="tab row" v-for="(payment, index) in voucherPayments">
                            <input :id="'tab-'+index" type="checkbox" name="tabs">
                            <div class="row">
                                <div><label :for="'tab-'+index"><i class="fa fa-list" aria-hidden="true"></i></label></div>
                                <div> {{ payment.pended_on }}</div>
                                <div class="count"> {{ payment.vouchers.length }}</div>
                                <div class="amount">&pound;{{ payment.vouchers.length }}</div>
                                <div class="email"><input type="radio" name="radio-group" @click="recordSelect" v-bind:id="payment.pended_on"></div>
                            </div>
                            <div class="tab-content">
                                <div class="tab inner-thead">
                                    <label></label>
                                        <div class="row-code">
                                          <div>Voucher code</div>
                                          <div>Voucher added on</div>
                                      </div>
                                </div>
                                <div class="tab" v-for="voucher in payment.vouchers">
                                    <label>
                                        <div class="row-code">
                                            <div class="code">{{ voucher.code }}</div>
                                            <div class="date">{{ voucher.recorded_on }}</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="cta-buttons">
                        <button v-on:click="onRequestSubmissionEmail" :disabled="selected">Email selected payment record</button>
                        <button id="requestVoucherHistoryEmail" v-on:click="onRequestVoucherHistoryEmail">Email all payment records</button>
                    </div>

                </div>

                <div v-else><p>You don't have any payment records yet. Add some vouchers and request payment to see your payment records here.</p></div>

            </div>

        </main>
    </div>
</template>

<script>
    import Store from '../store.js';
    import mixins from '../mixins/mixins';
    import NetMgr from '../services/netMgr.js';
    import constants from "../constants";

    export default {
        name: 'account',
        mixins: [
            mixins.messages
        ],
        data() {
            return {
                voucherPayments: Store.trader.pendedVouchers,
                errorMessage : Store.error,
                goodFeedback : false,
                selected : true,
                selectedDate: null
            }
        },
        methods: {
            recordSelect: function(event) {
                this.selected = false;
                // Default to requesting all.
                this.selectedDate = event.target.id || null;
            },
            onRequestSubmissionEmail : function() {
                var url = '/traders/' + Store.trader.id + '/voucher-history-email';
                this.requestEmailBeSent(url,
                    {
                        "submission_date" : this.selectedDate
                    }
                );
            },
            onRequestVoucherHistoryEmail: function() {
                var url = '/traders/' + Store.trader.id + '/voucher-history-email';
                this.requestEmailBeSent(url,
                    {
                        "submission_date" : null
                    }
                );
            },
            requestEmailBeSent: function(url, data) {
                // This is a POST, look for the data as a JSON object
                NetMgr.apiPost(url,data,
                    function (response) {
                        // write the response into the page
                        var mailMsg = "";
                        switch (response.status) {
                            case 202 :
                                this.goodFeedback = true;
                                mailMsg = response.data.message;
                                break;
                            default :
                                this.goodFeedback = false;
                                mailMsg = "Something went wrong, please try again later.";
                                console.log(response); // because we need to see what the server said somewhere.
                        }
                        var state = this.goodFeedback ? constants.MESSAGE_SUCCESS : constants.MESSAGE_ERROR;
                        this.setMessage(mailMsg, state);
                    }.bind(this),
                    // failure function
                    function (error) {
                        // at the moment, dump the error for analysis.
                        if (error) { console.log(error) }
                    }
                );
            }
        },
        mounted: function () {
            Store.getVoucherPaymentState();
        }
    }
</script>
