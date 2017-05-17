<template id="payment">
  <div>
      <masthead></masthead>
      <main class="container" id="payment">

          <div class="content">
              <h1>Voucher list</h1>

              <button>Get a payment</button>

              </form>

          </div>

      </main>
  </div>
</template>

<script>
import Logo from '../components/Logo.vue';
import Masthead from '../components/Masthead.vue';
export default {
    name: 'payment',
    components: {
        Logo,
        Masthead
    },
    data() {
        return {
            selected: false
        }
    }
}

</script>
