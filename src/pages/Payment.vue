<template>
    <div>
        <main class="container fullwidth" id="payment">

            <div class="content fullwidth">
                <h1>My Voucher List</h1>

                <p>You can request payment for <strong>{{ recVouchers[0].length }}</strong> vouchers.</p>

                <div class="voucher-list" id="registeredVouchers">

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

                <button class="smaller">Get payment</button>

            </div>

        </main>
    </div>
</template>

<script>
import Store from '../store.js';
export default {
    name: 'payment',
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
