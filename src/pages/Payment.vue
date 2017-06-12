<template>
    <div>
        <main class="container fullwidth" id="payment">

            <div class="content fullwidth">
                <h1 v-if="vouchersAdded" v-on:click="collapsed = !collapsed" class="expandable" v-bind:class="{'expanded' : !collapsed}">You can request payment for <strong>{{ voucherCount }}</strong> voucher<span v-if="voucherCount > 1">s</span>.</h1>
                <h1 v-else>You haven't added any vouchers yet.</h1>

                <div class="list-wrapper" v-bind:class="{'is-collapsed' : collapsed }">

                    <div class="voucher-list" id="registeredVouchers" v-if="vouchersAdded">

                        <!-- Tab header -->
                        <div class="tab thead">
                            <label>
                                <div class="row-code">
                                    <div>Voucher code</div>
                                    <div>Date added</div>
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

                    <button v-on:click="onDownloadVouchers('application/csv')">Send to my email</button>

                </div>

                <instructions></instructions>

                <button id="requestPayment" v-if="vouchersAdded" v-on:click="onRequestPayment">Request payment</button>

            </div>

        </main>
    </div>
</template>

<script>
import Store from '../store.js';
import Instructions from '../components/Instructions.vue';
import NetMgr from '../services/netMgr.js';
export default {
    name: 'payment',
    components: {
        Instructions
    },
    data() {
        return {
            recVouchers : Store.recVouchers,
            collapsed : true,
            voucherCount : 0
        }
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
        onDownloadVouchers(format) {
            // Direct access to the get function is unpleasant, but seems necessary for applying a one of CFG change.
            var cfg = { headers : { 'Accept' : format}};
            NetMgr.axiosInstance.get('/traders/' + Store.trader.id + '/vouchers?status=unconfirmed', cfg)
                .then(function(response) {
                    var link = document.createElement("a");
                    link.download = 'vouchers.csv';
                    link.href = 'data:' + response.headers['content-type'] + ',' + encodeURIComponent(response.data);
                    link.click();
                })
                .catch(); //TODO : bad file request handling
        },
        onRequestPayment() {
            Store.pendRecVouchers(
                // on Success, route to /account
                function(response) {
                    this.$router.push('/account');
                }.bind(this),
                // on Failure... hook for an alert?
                function(error) {

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
