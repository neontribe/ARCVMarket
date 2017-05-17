<template>
    <div>
        <main class="container" id="account">

            <div class="content">

                <h1>Hello, Market Stall Name.</h1>

                <p>You have added 31 valid vouchers.</p>

                <router-link v-bind:to="'/tap'" class="link"><button>Add vouchers</button></router-link>
                <router-link v-bind:to="'/payment'" class="link"><button>Request payment</button></router-link>

            </div>

        </main>
    </div>
</template>

<script>
export default {
    name: 'account'
}
</script>
