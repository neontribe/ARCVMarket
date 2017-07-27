<template id="queue">
    <transition name="fade"  v-if="currentlyShown">
    <div class="content narrow queuedVouchers">

        <h1>Queued vouchers</h1>

        <message v-bind:text="message.text" v-bind:state="message.state"></message>

        <div v-on:click="collapsed = !collapsed" class="expandable queue" v-bind:class="{'expanded' : !collapsed}"><i class="fa fa-list" aria-hidden="true"></i></div>

        <button id="submitQueuedVouchers"
            class="cta queuedVouchers"
            v-on:click="onSubmitQueue"
            v-bind:class="[{ spinner: this.spinner }, { validate: this.validate }, { fail: this.fail }]"
        ><span class="hidden offscreen">Submit queued vouchers</span></button>

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
                <div class="tab row" v-for="voucher in vouchers">
                    <label>
                        <div class="row-code">
                            <div>{{ voucher.code }}</div>
                        </div>
                    </label>
                </div>

            </div>

        </div>

    </div>
    </transition>
</template>

<script>
import Store from '../store.js';
import mixin from '../mixins/mixins';
import Message from './Message.vue';

import constants from '../constants';

const RESULT_TIMER = 5000;

export default {
    name: 'queue',
    components: {
        Message
    },
    mixins: [
        mixin.messages,
    ],
    data: function() {
        return {
            queue: Store.queue,
            collapsed : true,
            show : true,
            netMgr: Store.netMgr,
            vouchers : Store.trader.vouchers,
            spinner: false,
            validate: false,
            fail: false,
        }
    },
    created: function() {
      this.message.text = this.queueStatus;
    },
    watch: {
        queue: {
            handler: function(val) {
                // Because we submit cached queued vouchers on reload in store we need to watch the status of this..
                // so that we can reflect any changes in the Queue component.
                var queueState = val.sendingStatus;
                if (!queueState && val.sentData) {
                    var message = val.sentData.data.message;
                    this.emitMessage(message, constants.MESSAGE_SUCCESS);
                    this.showValidate();
                } else if(!queueState) {
                    this.spinner = false;
                }
            },
            deep: true
        },
        vouchers: function() {
            this.setMessage(this.queueStatus, constants.MESSAGE_STATUS);
        }
    },
    mounted: function() {
        if(Store.queue.sendingStatus) {
            this.startSpinner();
        }
    },
    computed: {
        currentlyShown: function() {
            return (
                this.fail
                || (this.vouchers.length >= 1 && !Store.getVouchersOnlineStatus())
            );
        },
        queueStatus: function() {
            var pluralise = (this.vouchers.length > 1 || this.vouchers.length === 0) ? 's' : '';
            var status = 'You have <strong>' + this.vouchers.length + '</strong> voucher'
                + pluralise
                + ' in your queue.'
                + ' Queued vouchers will be checked when you submit your queue.'
            ;

            return status;
        }
    },
    methods: {
        startSpinner: function() {
            this.spinner = true;
        },

        showValidate: function() {
            this.spinner = false;
            this.validate = true;

            setTimeout(function() {
                this.validate = false;
            }.bind(this), RESULT_TIMER);
        },

        showFail: function() {
            this.spinner = false;
            this.fail = true;

            setTimeout(function() {
                this.fail = false;
            }.bind(this), RESULT_TIMER);
        },

        onSubmitQueue: function() {
            this.startSpinner();

            Store.transitionVouchers('collect', Store.getTraderVoucherList(),
                function(response) {
                    // The server has processed our list, clear it.
                    Store.clearVouchers();
                    Store.getRecVouchers();

                    var message = '';
                    var messageType = constants.MESSAGE_SUCCESS;

                    // We need to check warning because a queue can contain just one voucher.
                    if (response.data.warning) {
                        message = response.data.warning;
                        messageType = constants.MESSAGE_WARNING;
                    } else if (response.data.message) {
                        message = response.data.message;
                    }

                    this.emitMessage(message, messageType);
                    this.showValidate();
                }.bind(this),

                function() {
                    this.emitMessage(
                        constants.copy.QUEUE_NETWORK_ERROR,
                        constants.MESSAGE_ERROR,
                    );

                    this.showFail();
                }.bind(this)
            );
        }
    }
}
</script>
