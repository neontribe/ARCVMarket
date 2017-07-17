<template id="message">
  <transition name="fade" v-if="visible">
    <div class="message" v-bind:class="{'error': error, 'success': success, 'warning': warning}" v-html="text"></div>
  </transition>
</template>

<script>
  import constants from '../constants';

  export default {
      name: 'message',
      props: {
          text:  { default: '' },
          state: { default: constants.MESSAGE_STATUS },
          shown: { default: true },
      },
      data: function() {
          return {}
      },
      computed: {
          error: function() {
              return this.state === constants.MESSAGE_ERROR;
          },
          status: function() {
              return this.state === constants.MESSAGE_STATUS;
          },
          success: function() {
              return this.state === constants.MESSAGE_SUCCESS;
          },
          warning: function() {
              return this.state === constants.MESSAGE_WARNING;
          },
          visible: function() {
              return (this.shown && this.text);
          }
      }
  }
</script>
