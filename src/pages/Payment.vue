<template>
    <div>
        <main class="container fullwidth" id="payment">

            <div class="content fullwidth">
                <h1 v-if="recVouchers[0] && recVouchers[0].length > 0" v-on:click="collapsed = !collapsed" class="expandable" v-bind:class="{'expanded' : !collapsed}">You can request payment for <strong>{{ recVouchers[0].length }}</strong> vouchers.</h1>
                <h1 v-else>You haven't added any vouchers yet.</h1>

                <div class="list-wrapper" v-bind:class="{'is-collapsed' : collapsed }">

                    <div class="two-buttons">
                        <button class="left alt" 
                            v-on:click="getRecVouchers('application/csv')"
                        >Download .csv</button>
                        <button class="right"
                            v-on:click="getRecVouchers('application/xlsx')"
                        >Download .xlsx</button>
                    </div>

                    <div class="voucher-list" id="registeredVouchers" v-if="recVouchers[0] && recVouchers[0].length > 0">

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

                <router-link v-bind:to="'/account'"><button v-if="recVouchers[0] && recVouchers[0].length > 0">Get payment</button></router-link>

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
            collapsed: true
        }
    },
    methods: {
        getRecVouchers(format) {
            NetMgr.setAccess(format);
            NetMgr.apiGet('/traders/' + Store.trader.id + '/vouchers');
        },
    },
    mounted: function() {
        // initialise the current vouchers list;
        Store.getRecVouchers();
    }
}

</script>
