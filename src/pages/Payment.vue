<template>
    <div>
        <main class="container fullwidth" id="payment">

            <div class="content fullwidth">
                <h1 v-if="recVouchers[0].length > 0">You can request payment for <strong>{{ recVouchers[0].length }}</strong> vouchers.</h1>
                <h1 v-else>You haven't added any vouchers yet.</h1>

                <div class="voucher-list" id="registeredVouchers" v-if="recVouchers[0].length > 0">

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

                <button class="smaller">Download list</button>

                <instructions></instructions>

                <button class="smaller">Get payment</button>

            </div>

        </main>
    </div>
</template>

<script>
import Store from '../store.js';
import Instructions from '../components/Instructions.vue';
export default {
    name: 'payment',
    components: {
        Instructions
    },
    data() {
        return {
            recVouchers : Store.recVouchers
        }
    },
    mounted: function() {
        // initialise the current vouchers list;
        Store.getRecVouchers();
    }
}

</script>
