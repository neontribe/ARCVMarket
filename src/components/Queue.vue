<template id="queue">

    <div>

        <div class="content narrow">

            <h1 v-on:click="collapsed = !collapsed" class="expandable queue" v-bind:class="{'expanded' : !collapsed}">Queued vouchers</h1>

            <button class="cta">Send queued vouchers</button>

            <div class="list-wrapper" v-bind:class="{'is-collapsed' : collapsed }">

                <div class="voucher-list">

                    <!-- Tab header -->
                    <div class="tab thead">
                        <label>
                            <div class="row-code">
                                <div>Voucher code</div>
                                <div>Voucher added on</div>
                            </div>
                        </label>
                    </div>

                    <!-- Tab row -->
                    <div class="tab row">
                        <label>
                            <div class="row-code">
                                <div>RVP12345522</div>
                                <div>18/6/2017</div>
                            </div>
                        </label>
                    </div>

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
            collapsed : true
        }
    }
}
</script>
