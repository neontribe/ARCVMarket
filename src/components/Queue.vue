<template id="queue">
    <transition name="fade"  v-if="currentlyShown">
    <div class="content narrow queuedVouchers">

        <h1 v-on:click="collapsed = !collapsed" class="expandable queue" v-bind:class="{'expanded' : !collapsed}">Queued vouchers d</h1>

        <transition name="fade" v-if="show">
            <div v-if="!message" class="goodmessage queue">
                You have <strong>{{ vouchers.length }}</strong> vouchers in your queue.
            </div>
            <div v-if="message" class="goodmessage queue">
                {{ message }}
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
                            <div>{{ voucher }}</div>
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
            return (this.fail
            || this.validate
            || (this.vouchers.length >= 1 && !this.netMgr.online)
            || this.queue.sendingStatus);
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

            Store.transitionVouchers('collect', this.vouchers, function(response) {
                // The server has processed our list, clear it.
                Store.clearVouchers();
                Store.getRecVouchers();

                    var data = response.data;
                    this.showValidate();
                    this.message
                        = "Thanks! "
                        + data.success.length
                        + " vouchers were accepted, "
                        + data.fail.length
                        + " were rejected and "
                        + data.invalid.length
                        + " were invalid."
                    ;
                    this.$emit('update', this.clearMessage);

            }.bind(this),
            function() {
                this.showFail();
            }.bind(this));
        }
    }
}
</script>
