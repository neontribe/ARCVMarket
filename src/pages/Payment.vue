<template>
    <div>
        <main class="container fullwidth" id="payment">

            <div class="content fullwidth">
                <h1>My Voucher List</h1>

                <p>You can request payment for <strong>3</strong> vouchers.</p>

                <div class="voucher-list">

                    <!-- Tab header -->
                    <div class="tab thead">
                        <label for="tab-one">
                            <div class="row">
                                <div>Voucher code</div>
                                <div>Date added</div>
                            </div>
                        </label>
                    </div>

                    <!-- Tab row -->
                    <div class="tab row">
                        <label for="tab-two">
                            <div class="row">
                                <div>RVP12345565</div>
                                <div>15/2/17</div>
                            </div>
                        </label>
                    </div>

                    <!-- Tab row -->
                    <div class="tab row">
                        <label for="tab-two">
                            <div class="row">
                                <div>RVP12345569</div>
                                <div>1/3/17</div>
                            </div>
                        </label>
                    </div>

                    <!-- Tab row -->
                    <div class="tab row">
                        <label for="tab-two">
                            <div class="row">
                                <div>RVP12345561</div>
                                <div>21/3/17</div>
                            </div>
                        </label>
                    </div>

                </div>

                <button class="smaller">Get payment</button>

            </div>

        </main>
    </div>
</template>

<script>
export default {
    name: 'payment',
    data() {
        return {
            selected: false
        }
    }
}

</script>
