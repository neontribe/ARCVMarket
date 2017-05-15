<template>
    <main class="container" id="scan">

        <div class="content">

            <h1>Scan a voucher</h1>

            <div><button v-on:click="emit">Clique me to emit from child component</button></div>

        </div>

      </main>
</template>

<script>
export default {
  name: 'scan',
  methods: {
    onClickButton (event) {
      this.$emit('clicked', 'someValue')
    }
  }
}
</script>
