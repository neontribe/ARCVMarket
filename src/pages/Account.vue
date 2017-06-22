<template>
    <div>
        <main class="container fullwidth" id="account">

            <div class="content fullwidth">
                <h1>Requested Payments</h1>

                <transition name="fade"><div v-if="errorMessage" v-bind:class="[goodFeedback ? 'good.message' : 'message' ]">{{ errorMessage }}</div></transition>

                <div class="accordion">

                    <!-- Tab header -->
                    <div class="tab thead">
                        <label>
                            <div class="row">
                                <div>Request date</div>
                                <div class="total"></div>
                                <div>Amount</div>
                                <div></div>
                            </div>
                        </label>
                    </div>

                    <div class="tab row" v-for="(payment, index) in this.voucherPayments[0]">
                        <input :id="'tab-'+index" type="checkbox" name="tabs">
                        <label :for="'tab-'+index">
                            <div class="row">
                                <div> {{ payment.pended_on }}</div>
                                <div> {{ payment.vouchers.length }}</div>
                                <div class="amount">&pound;{{ payment.vouchers.length }}</div>
                                <div class="email"><i class="fa fa-envelope" aria-hidden="true" :id="payment.pended_on" v-on:click="onRequestSubmissionEmail" title="Send this record to my email"></i></div>
                            </div>
                        </label>
                        <div class="tab-content">
                            <div class="tab inner-thead">
                                <label>
                                    <div class="row-code">
                                        <div>Voucher code</div>
                                        <div>Voucher added on</div>
                                    </div>
                                </label>
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

                <button id="requestVoucherHistoryEmail" v-on:click="onRequestVoucherHistoryEmail">Email payment history</button>

            </div>

        </main>
    </div>
</template>

<script>
    import Store from '../store.js';
    import NetMgr from '../services/netMgr.js';
    export default {
        name: 'account',
        data() {
            return {
                voucherPayments: Store.trader.pendedVouchers,
                errorMessage : Store.error,
                goodFeedback : false
            }
        },
        created: function () {

        },
        methods: {
            onRequestSubmissionEmail : function(event) {
                var url = '/traders/' + Store.trader.id + '/voucher-history-email';
                this.requestEmailBeSent(url,{"submission_date" : event.target.id})
            },
            onRequestVoucherHistoryEmail: function() {
                var url = '/traders/' + Store.trader.id + '/voucher-history-email';
                this.requestEmailBeSent(url,{ "submission_date" : null});
            },
            requestEmailBeSent: function(url,data) {
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
                        this.errorMessage = mailMsg;
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
