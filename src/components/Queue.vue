<template id="queue">
    <transition name="fade"  v-if="currentlyShown">
    <div class="content narrow queuedVouchers">

        <h1 v-on:click="collapsed = !collapsed" class="expandable queue" v-bind:class="{'expanded' : !collapsed}">Queued vouchers</h1>

        <transition name="fade" v-if="show">
            <div v-if="fail && message" class="message error">
                {{ message }}
            </div>
            <div v-if="message" class="message">
                {{ message }}
            </div>
            <div v-else class="message">
                You have <strong>{{ vouchers.length }}</strong> vouchers in your queue.
            </div>
        </transition>

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

const RESULT_TIMER = 5000;

export default {
    name: 'queue',
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
            message: '',
            clearMessage: true
        }
    },
    watch: {
      queue: {
          handler: function(val, oldVal) {
              let queueState = val.sendingStatus || false;
              if(!queueState && this.netMgr.online) {
                  this.showValidate();
              } else if(!queueState) {
                  this.spinner = false;
              }

          },
          deep: true
      },

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
                || this.validate
                || (this.vouchers.length >= 1 && !Store.getVouchersOnlineStatus())
            );
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
                this.message = '';
            }.bind(this), RESULT_TIMER);
        },

        showFail: function() {
            this.spinner = false;
            this.fail = true;

            this.message = "Whoops! There may be a network problem. When you have a better signal, click 'Submit queued vouchers' to retry.";
            setTimeout(function() {
                this.fail = false;
                this.message = '';
            }.bind(this), RESULT_TIMER);
        },

        onSubmitQueue: function() {
            this.startSpinner();

            Store.transitionVouchers('collect', Store.getTraderVoucherList(), function(response) {
                // The server has processed our list, clear it.
                Store.clearVouchers();
                Store.getRecVouchers();

                var data = response.data;
                var success = '';
                var fail = '';
                var invalid = '';

                // Construct the feedback message.
                if (data.success.length === 1) {
                    success = "1 voucher was accepted, ";
                } else {
                    success = data.success.length + " vouchers were accepted, ";
                }

                if (data.fail.length === 1) {
                    fail = " 1 was a duplicate ";
                } else {
                    fail = data.fail.length + " were duplicates ";
                }

                if (data.invalid.length === 1) {
                    invalid = "and 1 was invalid.";
                } else {
                    invalid = "and " + data.invalid.length + " were invalid.";
                }

                this.message
                    = "Thanks! Your queue has been successfully submitted. "
                    + success
                    + fail
                    + invalid
                ;

                this.showValidate();
                // Send out an update which will be picked up in tap, so that it can hide the not enough signal message
                this.$emit('update', this.clearMessage);

            }.bind(this),
            function() {
                this.showFail();
            }.bind(this));
        }
    }
}
</script>
