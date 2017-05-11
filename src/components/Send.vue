<template>
  <main class="container" id="send">

    <div class="content">
      <h1>You can request payment for 33 vouchers.</h1>

      <form>

          <p>How many vouchers should we pay you for?</p>

          <div class="form-group">

            <div class="multiple-choice">
              <input id="radio-inline-1" type="radio" name="radio-inline-group" :value="false" v-model="selected">
              <label for="radio-inline-1">All</label>
            </div>

            <div class="multiple-choice">
              <input id="radio-inline-2" type="radio" name="radio-inline-group" :value="true" v-model="selected">
              <label for="radio-inline-2">Some</label>
            </div>

          </div>

          <transition name="fade">
            <div v-if="selected">How many?<br />
              <input id="voucherNumber" type="tel" maxlength="3">
            </div>
          </transition>

          <button>Request payment</button>

      </form>

    </div>

  </main>
</template>

<script>
export default {
  name: 'send',
  data() {
    return {
      selected: false
    }
  }
}
</script>
