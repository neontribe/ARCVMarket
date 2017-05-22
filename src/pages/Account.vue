<template>
    <div>
        <main class="container fullwidth" id="account">

            <div class="content fullwidth">
                <h1>Requested Payments</h1>

                <div class="accordion">

                    <!-- Tab header -->
                    <div class="tab thead">
                        <label >
                            <div class="row">
                                <div>Date</div>
                                <div class="total"></div>
                                <div>Amount</div>
                            </div>
                        </label>
                    </div>

                    <div class="tab row" v-for="(payment, index) in this.voucherPayments[0]">
                        <input :id="'tab-'+index" type="checkbox" name="tabs">
                        <label :for="'tab-'+index">
                            <div class="row">
                                <div> {{ payment.payment_pending_on }}</div>
                                <div> {{ payment.vouchers.length }}</div>
                                <div class="amount">£{{ payment.vouchers.length }}</div>
                            </div>
                        </label>
                        <div class="tab-content">
                            <div class="tab inner-thead">
                                <label>
                                    <div class="row-code">
                                        <div>Voucher code</div>
                                        <div>Date added</div>
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

                <button class="smaller">Download list</button>

                <button class="smaller">Log out</button>

            </div>

        </main>
    </div>
</template>

<script>
    import Store from '../store.js';
    export default {
        name: 'account',
        data() {
            return {
                voucherPayments: Store.trader.pendedVouchers
            }
        },
        created: function () {

        },
        mounted: function () {
            Store.getVoucherPaymentState();
            console.log(this.voucherPayments);
        }
    }
</script>
