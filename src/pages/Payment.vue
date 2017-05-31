<template>
    <div>
        <main class="container fullwidth" id="payment">

            <div class="content fullwidth">
                <h1 v-if="vouchersAdded" v-on:click="collapsed = !collapsed" class="expandable" v-bind:class="{'expanded' : !collapsed}">You can request payment for <strong>{{ voucherCount }}</strong> voucher<span v-if="voucherCount > 1">s</span>.</h1>
                <h1 v-else>You haven't added any vouchers yet.</h1>

                <div class="list-wrapper" v-bind:class="{'is-collapsed' : collapsed }">

                    <!--<div class="two-buttons">-->
                        <button v-on:click="getRecVouchers('application/csv')"
                        >Download .csv</button>
                        <!-- <button class="right"
                            v-on:click="getRecVouchers('application/xlsx')"
                        >Download .xlsx</button>
                        </div>-->

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

                </div>

                <instructions></instructions>

                <router-link v-bind:to="'/account'"><button v-if="vouchersAdded">Get payment</button></router-link>

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
        getRecVouchers(format) {
            NetMgr.setAccept(format);
            NetMgr.apiGet('/traders/' + Store.trader.id + '/vouchers', function(response) {
                var link = document.createElement("a");
                link.download = 'vouchers.csv';
                link.href = 'data:'+response.headers['content-type']+',' + encodeURIComponent(response.data);
                link.click();
            });
        },
    },
    mounted: function() {
        // initialise the current vouchers list;
        Store.getRecVouchers();
    }
}

</script>
