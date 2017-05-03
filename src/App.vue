<template>

    <div id="app">

        <header>
            <img src="./assets/logo.png">
        </header>

        <div class="content">

          <h1>You want to add a voucher</h1>

          <div id="input">
              <form id="textVoucher"  v-on:submit.prevent>
                  <label for="voucherBox" id="lblVoucherBox">Type a voucher code</label>
                  <input id="voucherBox"
                         type="text"
                         v-model="voucherCode"
                  >
                  <button v-on:click="record" id="submitVoucher">Add</button>
                  <p>Current:  <span id=output> {{ voucherCode }} </span></p>
              </form>
              <div v-if="vouchers.length > 0">
                  <h2>Unsent Queue</h2>
                      <ul id="unsentVouchers" >
                          <li v-for="voucher in vouchers">
                              {{ voucher }}
                          </li>
                      </ul>
              </div>
          </div>

      </div>

  </div>

</template>

<script>
import Store from './store.js';

export default {
    name: 'app',
    data: function() {
        return {
        voucherCode : null,
        vouchers : Store.vouchers
        }
    },
    mounted: function() {
        //
    },
    methods:  {
        record: function(event) {
            if (this.voucherCode !== null) {
                if (Store.addVoucherCode(this.voucherCode)) {
                    this.voucherCode = null;
                };
            }
        }
    }
}

</script>

<style lang="scss">
    @import "sass/app.scss"
</style>
