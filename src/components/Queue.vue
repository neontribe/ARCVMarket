<template id="queue">

    <div class="content narrow">

        <h1 v-on:click="collapsed = !collapsed" class="expandable queue" v-bind:class="{'expanded' : !collapsed}">Queued vouchers</h1>

        <transition name="fade" v-if="show">
            <div class="goodmessage queue">
                [xXx] Thanks! We can't confirm the <strong>{{ vouchers.length }}</strong> vouchers just now, there may be a network problem. Keep adding to this list until they all go through.
            </div>
        </transition>

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
            vouchers : Store.vouchers
        }
    }

}
</script>
