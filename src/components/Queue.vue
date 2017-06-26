<template id="queue">

    <div class="content narrow queuedVouchers">

        <h1 v-on:click="collapsed = !collapsed" class="expandable queue" v-bind:class="{'expanded' : !collapsed}">Queued vouchers</h1>

        <transition name="fade" v-if="show">
            <div class="goodmessage queue">
                Thanks! We can't confirm the <strong>{{ vouchers.length }}</strong> vouchers just now, there may be a network problem. When you have a better signal, click 'Submit queued vouchers' to try and send them again.
            </div>
        </transition>

        <button class="cta" id="submitQueuedVouchers"><span class="hidden offscreen">Submit queued vouchers</span></button>

        <div class="list-wrapper" v-bind:class="{'is-collapsed' : collapsed }">

            <div class="voucher-list">

                <!-- Tab header -->
                <div class="tab thead">
                    <label>
                        <div class="row-code">
                            <div>Voucher code</div>
                        </div>
                    </label>
                </div>

                <!-- Tab row -->
                <div v-for="voucher in vouchers" class="tab row">
                    <label>
                        <div class="row-code">
                            <div>{{ voucher }}</div>
                        </div>
                    </label>
                </div>

            </div>

        </div>

    </div>

</template>

<script>
import Store from '../store.js';
export default {
    name: 'queue',
    data: function() {
        return {
            collapsed : true,
            show : true,
            vouchers : Store.trader.vouchers,
            spinner: false,
            validate: false,
            fail: false
        }
    }
}
</script>
